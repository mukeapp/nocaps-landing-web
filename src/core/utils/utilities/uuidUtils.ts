import v4 from 'react-native-uuid';
const generateUUID = (): string => {
  return v4.v4().toString();
};

const uuidUtils = {
  generateUUID,
};

export default uuidUtils;
