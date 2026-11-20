import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getLevenshteinDistance,
  validateGitCommand,
  TOPIC_REGISTRY,
} from '../src/lib/gitEngine.ts';

describe('Levenshtein Distance Algorithm', () => {
  test('returns 0 for identical strings', () => {
    assert.strictEqual(getLevenshteinDistance('git', 'git'), 0);
    assert.strictEqual(getLevenshteinDistance('commit', 'commit'), 0);
  });

  test('identifies single character differences (typos)', () => {
    assert.strictEqual(getLevenshteinDistance('got', 'git'), 1);
    assert.strictEqual(getLevenshteinDistance('gitt', 'git'), 1);
    assert.strictEqual(getLevenshteinDistance('gi', 'git'), 1);
  });

  test('handles distance between distant strings', () => {
    assert.ok(getLevenshteinDistance('completelyDifferent', 'git') >= 15);
  });
});

describe('Topic Registry & Curriculum Integrity', () => {
  const expectedStages = ['init', 'commit', 'branching', 'merging', 'remote'];

  test('contains all 5 canonical stages with positive XP', () => {
    for (const stageId of expectedStages) {
      const topic = TOPIC_REGISTRY[stageId];
      assert.ok(topic, `Topic stage '${stageId}' must exist in registry`);
      assert.ok(topic.xp > 0, `Topic '${stageId}' XP must be positive`);
      assert.ok(topic.hint.startsWith('git '), `Topic '${stageId}' hint must be a valid git command`);
      assert.ok(topic.theory.whatItIs.length > 20, `Theory 'whatItIs' must be comprehensive`);
      assert.ok(topic.theory.whyWeNeedIt.length > 20, `Theory 'whyWeNeedIt' must be comprehensive`);
      assert.ok(topic.theory.howItWorks.length > 20, `Theory 'howItWorks' must be comprehensive`);
      assert.ok(topic.theory.howItHelps.length > 20, `Theory 'howItHelps' must be comprehensive`);
    }
  });

  test('provides unbroken linear curriculum progression chain', () => {
    assert.strictEqual(TOPIC_REGISTRY.init.nextTopicId, 'commit');
    assert.strictEqual(TOPIC_REGISTRY.commit.nextTopicId, 'branching');
    assert.strictEqual(TOPIC_REGISTRY.branching.nextTopicId, 'merging');
    assert.strictEqual(TOPIC_REGISTRY.merging.nextTopicId, 'remote');
    assert.strictEqual(TOPIC_REGISTRY.remote.nextTopicId, null);
  });

  test('supports numeric string route aliases', () => {
    assert.strictEqual(TOPIC_REGISTRY['1'].id, 'init');
    assert.strictEqual(TOPIC_REGISTRY['01'].id, 'init');
    assert.strictEqual(TOPIC_REGISTRY['2'].id, 'commit');
    assert.strictEqual(TOPIC_REGISTRY['3'].id, 'branching');
    assert.strictEqual(TOPIC_REGISTRY['4'].id, 'merging');
    assert.strictEqual(TOPIC_REGISTRY['5'].id, 'remote');
  });
});

describe('Git Terminal Command Validation Engine', () => {
  test('rejects empty input with clear error message', () => {
    const res = validateGitCommand('   ', TOPIC_REGISTRY.init);
    assert.strictEqual(res.isValid, false);
    assert.match(res.errorMessage || '', /empty command/i);
  });

  test('suggests typo correction when root binary is mistyped', () => {
    const res = validateGitCommand('got init my-repo', TOPIC_REGISTRY.init);
    assert.strictEqual(res.isValid, false);
    assert.match(res.errorMessage || '', /did you mean 'git'/i);
  });

  describe('Stage 1: Init Validation', () => {
    test('accepts valid git init <repo-name>', () => {
      const res = validateGitCommand('git init quantum-core', TOPIC_REGISTRY.init);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.capturedArg, 'quantum-core');
    });

    test('rejects git init without repository name', () => {
      const res = validateGitCommand('git init', TOPIC_REGISTRY.init);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /missing repository name/i);
    });

    test('detects typos in subcommand (e.g. git initt)', () => {
      const res = validateGitCommand('git initt my-repo', TOPIC_REGISTRY.init);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /did you mean 'init'/i);
    });
  });

  describe('Stage 2: Commit Validation', () => {
    test('accepts valid git commit -m "message"', () => {
      const res = validateGitCommand('git commit -m "feat: genesis block"', TOPIC_REGISTRY.commit);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.capturedArg, 'feat: genesis block');
    });

    test('accepts valid single-quoted commit messages', () => {
      const res = validateGitCommand("git commit -m 'feat: initial snapshot'", TOPIC_REGISTRY.commit);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.capturedArg, 'feat: initial snapshot');
    });

    test('detects missing -m flag with guidance', () => {
      const res = validateGitCommand('git commit "missing flag"', TOPIC_REGISTRY.commit);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /missing '-m' flag/i);
    });

    test('detects unclosed quotation marks', () => {
      const res = validateGitCommand('git commit -m "unclosed quote', TOPIC_REGISTRY.commit);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /unclosed quotation marks/i);
    });

    test('rejects empty commit message', () => {
      const res = validateGitCommand('git commit -m ""', TOPIC_REGISTRY.commit);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /empty commit message/i);
    });
  });

  describe('Stage 3: Branching Validation', () => {
    test('accepts git branch <branch-name>', () => {
      const res = validateGitCommand('git branch feature/hyperdrive', TOPIC_REGISTRY.branching);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.capturedArg, 'feature/hyperdrive');
    });

    test('accepts git checkout -b <branch-name>', () => {
      const res = validateGitCommand('git checkout -b feature/warp-speed', TOPIC_REGISTRY.branching);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.capturedArg, 'feature/warp-speed');
    });

    test('detects typo in branch command (e.g. git branc)', () => {
      const res = validateGitCommand('git branc feature/nova', TOPIC_REGISTRY.branching);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /did you mean 'branch'/i);
    });
  });

  describe('Stage 4: Merging Validation', () => {
    test('accepts git merge <branch-name>', () => {
      const res = validateGitCommand('git merge feature/quantum-leap', TOPIC_REGISTRY.merging);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.capturedArg, 'feature/quantum-leap');
    });

    test('detects missing branch name in merge', () => {
      const res = validateGitCommand('git merge', TOPIC_REGISTRY.merging);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /no branch specified/i);
    });
  });

  describe('Stage 5: Remote Validation', () => {
    test('accepts git push origin main', () => {
      const res = validateGitCommand('git push origin main', TOPIC_REGISTRY.remote);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.capturedArg, 'main');
    });

    test('requires origin remote peer specification', () => {
      const res = validateGitCommand('git push main', TOPIC_REGISTRY.remote);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /invalid remote specification/i);
    });

    test('detects typo in push command', () => {
      const res = validateGitCommand('git psh origin main', TOPIC_REGISTRY.remote);
      assert.strictEqual(res.isValid, false);
      assert.match(res.errorMessage || '', /did you mean 'push'/i);
    });
  });
});
