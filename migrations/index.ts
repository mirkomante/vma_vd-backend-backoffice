import * as migration_20260929_141010_initial_schema from './20260929_141010_initial_schema';
import * as migration_20261003_155849_localization_enum from './20261003_155849_localization_enum';
import * as migration_20261005_134746_add_reset_password_requested_at from './20261005_134746_add_reset_password_requested_at';
import * as migration_20261006_083421_add_impostazioni_sistema_global from './20261006_083421_add_impostazioni_sistema_global';
import * as migration_20261006_091528_add_impostazioni_sistema_orari_chiusure from './20261006_091528_add_impostazioni_sistema_orari_chiusure';
import * as migration_20261006_114919_add_impostazioni_sistema_calendario_comunicazioni from './20261006_114919_add_impostazioni_sistema_calendario_comunicazioni';
import * as migration_20261010_071726_add_admin_role_manager from './20261010_071726_add_admin_role_manager';

export const migrations = [
  {
    up: migration_20260929_141010_initial_schema.up,
    down: migration_20260929_141010_initial_schema.down,
    name: '20260929_141010_initial_schema',
  },
  {
    up: migration_20261003_155849_localization_enum.up,
    down: migration_20261003_155849_localization_enum.down,
    name: '20261003_155849_localization_enum',
  },
  {
    up: migration_20261005_134746_add_reset_password_requested_at.up,
    down: migration_20261005_134746_add_reset_password_requested_at.down,
    name: '20261005_134746_add_reset_password_requested_at',
  },
  {
    up: migration_20261006_083421_add_impostazioni_sistema_global.up,
    down: migration_20261006_083421_add_impostazioni_sistema_global.down,
    name: '20261006_083421_add_impostazioni_sistema_global',
  },
  {
    up: migration_20261006_091528_add_impostazioni_sistema_orari_chiusure.up,
    down: migration_20261006_091528_add_impostazioni_sistema_orari_chiusure.down,
    name: '20261006_091528_add_impostazioni_sistema_orari_chiusure',
  },
  {
    up: migration_20261006_114919_add_impostazioni_sistema_calendario_comunicazioni.up,
    down: migration_20261006_114919_add_impostazioni_sistema_calendario_comunicazioni.down,
    name: '20261006_114919_add_impostazioni_sistema_calendario_comunicazioni',
  },
  {
    up: migration_20261010_071726_add_admin_role_manager.up,
    down: migration_20261010_071726_add_admin_role_manager.down,
    name: '20261010_071726_add_admin_role_manager'
  },
];
