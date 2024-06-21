const axios = require('axios');

class WhatsappService {
    constructor(){
        this.accessToken = process.env.WHATSAPP_TOKEN
        this.url = process.env.WHATSAPP_URL
    }

    checkValidPhoneNumber = (phoneNumber) => {
     
      const phoneNumberRegex = /^(?:\+91|91)?\d{10}$/;
  
      // Check if phoneNumber is not null, undefined, or empty and matches the regex
      if (phoneNumber && phoneNumberRegex.test(phoneNumber)) {
          if ((phoneNumber.startsWith("+91") && phoneNumber.length === 13) || 
              (phoneNumber.startsWith("91") && phoneNumber.length === 12) ||
              (phoneNumber.startsWith("91") && phoneNumber.length === 10) ||
              (!phoneNumber.startsWith("+91") && !phoneNumber.startsWith("91") && phoneNumber.length === 10)) {
              return true; // Valid phoneNumber
          }
      }
      return false; // Invalid phoneNumber
    }
  

  sendWhatsappMessageTemplate = (phoneNumber, templateName, templateParameters) => {
    return new Promise((resolve, reject) => {
      const data = {
        "messaging_product": "whatsapp",
        "to": phoneNumber,
        "type": "template",
        "category": "marketing",
        "template": {
          "name": templateName,
          "language": {
            "code": "en"
          },
          "components": [
            {
              "type": "header",
              "parameters": [
                {
                  "type": "image",
                  "image": {
                    "link": "https://via.placeholder.com/400"
                  }
                },
                // {
                //   "type" : 'body',
                //   "parameters": templateParameters 
                // }
              ]
            }
          ]
        }
      };
      axios.post(this.url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log('Response:', response.data);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
        reject(error);
      });
    });
  };
  
      sendMultipleWhatsappMessages = (data) => {
        return new Promise(async (resolve, reject) => {
          try {
            const {phoneList,templateParameters,templateName} = data
           
            const uniquePhoneList = [...new Set(phoneList)];
            const whatsappMessagePromiseArr = []
            for (let phoneNumberIndex = 0; phoneNumberIndex < uniquePhoneList.length; phoneNumberIndex++) {
              if(this.checkValidPhoneNumber(uniquePhoneList[phoneNumberIndex])){
                whatsappMessagePromiseArr.push(await this.sendWhatsappMessageTemplate(uniquePhoneList[phoneNumberIndex], templateName,templateParameters));
                console.log("valid")
              } else{
                console.error("Invalid phone number")
              }
            }
            Promise.allSettled(whatsappMessagePromiseArr).then((result) => {
              console.log("🚀 ~ WhatsappService ~ Promise.allSettled ~ result:", result)
              resolve(true)
            }).catch((error) => {
              reject(error)
            })
          } catch (error) {
            reject(error)
          }
        })
      }



  whatsappMessageTemplate = (phoneNumber, templateName, templateParameters, languageCode, category, image, countryCode) => {
    if(phoneNumber.length === 10) {
      phoneNumber = `${countryCode}${phoneNumber}`;
    }

    console.log("phoneNumber: ", phoneNumber);
    
    return new Promise((resolve, reject) => {
      const components = [];
      if(image) {
        components.push({
          "type": "header",
          "parameters": [
            {
              "type": "image",
              "image": {
                "link": image
              }
            }
          ]
        })
      }

      if(templateParameters && templateParameters.length > 0) {
        components.push({
          "type" : "body",
          "parameters": templateParameters 
        })
      }

      const data = {
        "messaging_product": "whatsapp",
        "to": phoneNumber,
        "type": "template",
        "category": category,
        "template": {
          "name": templateName,
          "language": {
            "code": languageCode
          },
        }
      };
      // Add components field only if it's not empty
      if (components.length > 0) {
        data.template.components = components;
      }
      console.log("Components: ", components);
      console.log("Data sended to user: ", data);
      
      axios.post(this.url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log('Response:', response.data);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
        reject(error);
      });
    });
  };

  sendWhatsappMessage = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { phoneList, templateParameters, templateName, languageCode, category, image, countryCode} = data
       
        const uniquePhoneList = [...new Set(phoneList)];
        const whatsappMessagePromiseArr = []
        for (let phoneNumberIndex = 0; phoneNumberIndex < uniquePhoneList.length; phoneNumberIndex++) {
          if(this.checkValidPhoneNumber(uniquePhoneList[phoneNumberIndex])){
            console.log("\nvalid\n")
            whatsappMessagePromiseArr.push(await this.whatsappMessageTemplate(uniquePhoneList[phoneNumberIndex], templateName, templateParameters, languageCode, category, image, countryCode));
          } else{
            console.error("\nInvalid phone number")
          }
        }
        Promise.allSettled(whatsappMessagePromiseArr).then((result) => {
          console.log("🚀 ~ WhatsappService ~ Promise.allSettled ~ result:", result)
          resolve(true)
        }).catch((error) => {
          reject(error)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = WhatsappService;
