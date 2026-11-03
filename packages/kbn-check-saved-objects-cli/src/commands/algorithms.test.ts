/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { getMigratorOptions, parseAlgorithmFlag } from './algorithms';

describe('parseAlgorithmFlag', () => {
  it.each([
    ['v2', ['v2']],
    ['zdt', ['zdt']],
    ['v3', ['v3']],
    ['both', ['v2', 'zdt']],
    ['all', ['v2', 'zdt', 'v3']],
  ])('runs %s with %j', (flag, algorithms) => {
    expect(parseAlgorithmFlag(flag)).toEqual(algorithms);
  });

  it('rejects unknown values, listing the valid ones', () => {
    expect(() => parseAlgorithmFlag('v4')).toThrow(
      "Invalid --algorithm value 'v4'. Must be one of: v2, zdt, v3, both, all"
    );
  });
});

describe('getMigratorOptions', () => {
  it('uses the Serverless behaviours for v3, except to create the index', () => {
    expect(getMigratorOptions('v3')).toEqual({
      settings: { migrations: { algorithm: 'v3' } },
      esCapabilities: { serverless: true },
    });
    expect(getMigratorOptions('v3', { createsIndex: true })).toEqual({
      settings: { migrations: { algorithm: 'v3' } },
    });
  });

  it('uses the Elasticsearch capabilities as they are for v2 and zdt', () => {
    expect(getMigratorOptions('zdt')).toEqual({ settings: { migrations: { algorithm: 'zdt' } } });
    expect(getMigratorOptions('v2')).toEqual({ settings: { migrations: { algorithm: 'v2' } } });
  });
});
