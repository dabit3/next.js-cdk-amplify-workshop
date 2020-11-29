#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NextBackendStack } from '../lib/next-backend-stack';

const app = new cdk.App();
new NextBackendStack(app, 'NextBackendStack');
