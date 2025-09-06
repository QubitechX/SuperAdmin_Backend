
exports.countryList = async () => {
  try {
    
    return {
      status: true,
      message: "countries List",
      statusCode: 200,
      data: "countryData",
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "An error occurred",
      statusCode: 500,
      data: error,
    };
  }
};



