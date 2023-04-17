const cds = require('@sap/cds');
const SapCfAxios = require('sap-cf-axios').default;
const SapCfAxiosObj = SapCfAxios('CF_CPI');
module.exports = cds.service.impl(async function () {
    /**
* Function to send Email by calling CPI endpoint
*/
    this.on('sendEmail', async (req) => {
        try {

            let payload = req.data.createData;

            response = await SapCfAxiosObj({
                method: 'POST',
                url: '/http/endpointurl1', //CPI Endpoint
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payload
            }).then(res => {
                console.log("CPI execution was Successful " + res);
                return 'SUCCESS';
            }).catch(async (error) => {
                console.log("Error in CPI call" + error);
                return error;
            })
            return response;
        }
        catch (error) {
            console.log("sendEmail error" + error);
            return error;
        }

    });
});
