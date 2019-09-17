export default (object) => {
  const proto = Object.getPrototypeOf(object);
  const jsonObj: any = Object.assign({}, object);

  Object.entries(Object.getOwnPropertyDescriptors(proto))
    .filter(([_, descriptor]) => typeof descriptor.get === 'function')
    .map(([key, descriptor]) => {
      if (descriptor && key[0] !== '_') {
        try {
          jsonObj[key] = (object as any)[key];
        } catch (error) {
          console.error(`Error calling getter ${key}`, error);
        }
      }
    });

  return jsonObj;
}