sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "sap/m/Token"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,BusyIndicator,Token) {
        "use strict";

        return Controller.extend("demo.cpi.projectui.controller.View1", {
            onInit: function () {
                //fetch the service model
                this.oDataModelT = this.getOwnerComponent().getModel();
            },
            onSaveData: function () {
                BusyIndicator.show();
                var toAdd = this.getView().byId("idInputEmailAddTo").getTokens(),
                    ccAdd = this.getView().byId("idInputEmailAddCC").getTokens(),
                    orderDate = this.getView().byId("idDatepicker").getValue(),oEmailString="",oEmailStringCC="";
                    if (orderDate !== "" && toAdd.length !== 0) {
                    for (var i = 0; i < toAdd.length; i++) {
                        var objEmail = toAdd[i].getKey();
                        if (i === 0) {
                            oEmailString = objEmail;
                        } else {
                            oEmailString = oEmailString + ';' + objEmail;
                        }
                    }
                    for (var j = 0; j < ccAdd.length; j++) {
                        var objEmail = ccAdd[j].getKey();
                        if (j === 0) {
                            oEmailStringCC = objEmail;
                        } else {
                            oEmailStringCC = oEmailStringCC + ';' + objEmail;
                        }
                    }
                var oJsonData = {
                    "a": {
                        "invoicedetails": [{
                            "To": oEmailString,
                            "Subject": "Invoice details",
                            "CC": oEmailStringCC,
                            "soldby": "LIMBO PVT LTD.",
                            "orderDate": orderDate,
                            "Phonenumber": "876543XXXX",
                            "Invoicenumber": "34567ERT231",
                            "orderdetails": {
                                "itemdetails": [{
                                    "productdetails": {
                                        "productname": [

                                            {
                                                "Product": "Iphone"
                                            },
                                            {
                                                "Product": "Sunglasses"
                                            },
                                            {
                                                "Product": "Digital Camera"
                                            }
                                        ]
                                    },
                                    "Pricedetails": {
                                        "pricevalue": [{
                                            "Pricename": "OriginalPrice",
                                            "Price1": 50000,
                                            "Price2": 10000,
                                            "Price3": 40000
                                        },
                                        {
                                            "Pricename": "CgstRt",
                                            "Price1": 1.500,
                                            "Price2": 1.500,
                                            "Price3": 1.500
                                        },
                                        {
                                            "Pricename": "SgstRt",
                                            "Price1": 0,
                                            "Price2": 0,
                                            "Price3": 0

                                        },
                                        {
                                            "Pricename": "IgstRt",
                                            "Price1": 0,
                                            "Price2": 0,
                                            "Price3": 0
                                        },
                                        {
                                            "Pricename": "TotalAmount",
                                            "Price1": 50001.500,
                                            "Price2": 10001.50,
                                            "Price3": 40001.50
                                        }
                                        ]
                                    }
                                }]
                            }
                        }]
                    }
                }
                var oPayloadCus = JSON.stringify(oJsonData)
                this.oDataModelT.callFunction("/sendEmail", {
                    method: 'POST',
                    urlParameters: {
                        createData: oPayloadCus
                    },
                    success: function (oData) {
                        BusyIndicator.hide();
                        if (oData.sendEmail === "SUCCESS") {
                            MessageBox.success("Email will be received shortly");
                            
                        }
                        else {
                            MessageBox.error(oData.sendEmail.name, {
                                title: "Technical Error" ,
                                details: oData.sendEmail.message,
                                contentWidth: "100px",
                                });
                        }
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        var msg = err.message;
                        MessageBox.error(msg, {
                            details: err
                        });

                    }
                });
            } 
            else {
                BusyIndicator.hide();
                MessageBox.error('Kindly fill the mandatory fields to proceed');
            }
            },
            /**
      * Method to validation on Email MutiInput
      * @public
      * @param {sap.ui.base.Event} oEvt An Event object consisting of an ID, a source and a map of parameter
      */
            onEmailChangeAdd: function (oEvt) {
                var oMultiInput1 = this.getView().byId(oEvt.getSource().getId()); //this.getView().byId("idInputEmailAdd");
                var sVal = oEvt.getParameters().value;
                var fnValidator = function (args) {
                    var email = args.text;
                    var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                    if (!mailregex.test(email)) {
                        oMultiInput1.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                        return new Token({ key: email, text: email });
                    }
                };
                if (sVal === "") {
                    oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                }
                oMultiInput1.addValidator(fnValidator);
            },            
        });
    });
