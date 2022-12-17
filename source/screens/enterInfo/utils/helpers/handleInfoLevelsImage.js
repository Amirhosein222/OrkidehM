import pinfoBg from '../../../../assets/vectors/register/pinfo.png';

export const handleInfoLevelsImage = (registerStage, settings) => {
  switch (registerStage) {
    case 0:
      return settings?.app_image_field_username
        ? { uri: settings.app_image_field_username.value }
        : pinfoBg;
    default:
      break;
  }
};
