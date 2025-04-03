const readTypesFromFile = (filePath) => {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  };
  
  const writeToFile = (filePath, data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log('File written successfully');
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

  //const types = readTypesFromFile('./types.json') ?? {};
        //const newType = { ...types, [fakerFR.vehicle.type()]: null };
        //console.log(typeof types);
        //writeToFile('./types.json', (newType));