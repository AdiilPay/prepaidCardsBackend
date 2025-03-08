#!/bin/sh
npx prisma generate
npx prisma generate --sql
npm run start