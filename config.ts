import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();

export const OER_APP_ID = config.requireSecret('oerAppId');
