declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare global {
    interface Window {
      grecaptcha: ReCaptchaV2.ReCaptcha;
    }
  }
  