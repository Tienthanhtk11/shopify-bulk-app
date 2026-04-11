import '@shopify/ui-extensions';
import type {Api} from '@shopify/ui-extensions/customer-account.profile.block.render';

//@ts-ignore
declare module './src/ProfileBlock.jsx' {
  const shopify: Api;
  const globalThis: { shopify: typeof shopify };
}
