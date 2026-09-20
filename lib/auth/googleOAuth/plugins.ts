import { OAuth2Plugin } from 'payload-oauth2'

import {
  buildGoogleOAuthAdminPluginOptions,
  buildGoogleOAuthAppPluginOptions,
} from './pluginOptions'

export const googleOAuthAdminPlugin = () => OAuth2Plugin(buildGoogleOAuthAdminPluginOptions())

export const googleOAuthAppPlugin = () => OAuth2Plugin(buildGoogleOAuthAppPluginOptions())
