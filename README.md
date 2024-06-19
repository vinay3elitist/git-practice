Author Book API

nodejs express mongodb jwt

    addMktgWhatsappUser = async (req, res) => {
        try {
            console.log("Add New User");
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                return responseService.send(res, {
                    status: responseService.getCode().codes.BAD_REQUEST,
                    message: messages.MISSING_PARAMETER,
                    data: false,
                });
            }

            await this.whatsappMarketingModel.addNewUser(req.body)
                .then((user) => {
                    return responseService.send(res, {
                        status: responseService.getCode().codes.OK,
                        message: messages.SUCCESS,
                        data: user
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return responseService.send(res, {
                        status: responseService.getCode().codes.INTERNAL_SERVER_ERROR,
                        message: messages.ERR_ADDING_USER,
                        data: false,
                    });
                });
        } catch (error) {
            console.log(error)
            return responseService.send(res, {
                status: responseService.getCode().codes.INTERNAL_SERVER_ERROR,
                message: messages.SERVER_ERROR_MESSAGE,
                data: false,
            });
        }
    }

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






















  sendWhatsappMessageTemplate = (phoneNumber, templateName, templateParameters) => {
    return new Promise((resolve, reject) => {
      const data = {
        "messaging_product": "whatsapp",
        "to": phoneNumber,
        "type": "template",
        "template": {
          "name": templateName,
          "language": {
            "code": "en_US" 
          },
          // "components": [
          //   {
          //     "type": "body",
          //     "parameters": templateParameters 
          //   }
          // ]
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
