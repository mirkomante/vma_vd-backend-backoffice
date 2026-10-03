import * as migration_20260929_141010_initial_schema from './20260929_141010_initial_schema';
import * as migration_20261003_155849_localization_enum from './20261003_155849_localization_enum';

export const migrations = [
  {
    up: migration_20260929_141010_initial_schema.up,
    down: migration_20260929_141010_initial_schema.down,
    name: '20260929_141010_initial_schema',
  },
  {
    up: migration_20261003_155849_localization_enum.up,
    down: migration_20261003_155849_localization_enum.down,
    name: '20261003_155849_localization_enum'
  },
];
