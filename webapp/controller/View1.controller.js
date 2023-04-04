sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageToast,Fragment) {
        "use strict";

        return Controller.extend("yui5demokachain.controller.View1", {
            onInit: function () {
                this._initModel();
                this._getTimelineSet();
                this._loadTimelineDtDialog();
            },
            _initModel: function(){
                var oData  = {};
                var oModel = new JSONModel(oData);

                this.getView().setModel(oModel);
            },
            _getTimelineSet: function(){
                var that        = this;
                // ดึง Service ที่เราประกาศไว้
                var oService    = this.getOwnerComponent().getModel();
                // อ่านค่าจาก entity set ใน oDATA 
                oService.read("/TimelineSet",{
                    success: function(oDATA, response){
                        that.getView().getModel().setProperty("/TimelineSet",oDATA.results);
                    },
                    error: function(oError){

                    }
                });
            },
            onPress: function(){
                this._timelineDtDialog.then(function(oDialog){
                    oDialog.open();
                    });

                    var that = this;
                    var oService = this.getOwnerComponent().getModel();
                    
                    oService.setHeaders({
                    "zaction": "NEW"
                    });
                    
                    oService.read("/TimelineSet(Username='',ItemNo='')",{
                    success: function(oData, response){
                        that.getView().getModel().setProperty("/Timeline", oData);
                    },
                    error: function(oError){
                        MessageBox.show("Error");
                    }
                    });

            },
            //Load Fragment , Then add to view
            //ตั้งชื่อ _นำหน้าเฉพาะ funtion ที่ใช้ภายใน controller
            _loadTimelineDtDialog: function(){
                var oView = this.getView();

                if (!this._timelineDtDialog) {
                    this._timelineDtDialog = Fragment.load({
                        id:oView.getId(),
                        name: "yui5demokachain.view.TimelineDt",
                        controller: this    
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
            },
            onCloseTimelineDt: function(){
                this._timelineDtDialog.then(function(oDialog){
                    oDialog.close();
                    });
            },
            _setTimelineDtBusy: function(bBusy){
                this.byId("idTimelineDtDialog").setBusy(bBusy);
            },
                
            onCreateTimelineDt: function(){
                var that = this;
                var oService = this.getOwnerComponent().getModel();
                
                
                var oTimeline = this.getView().getModel().getProperty("/Timeline");
                
                this._setTimelineDtBusy(true);
                
                oService.setHeaders({
                "zaction": "CREATE"
                });
                
                oService.create("/TimelineSet", oTimeline, {
                success: function(oData, response){
                that._timelineDtDialog.then(function(oDialog){
                oDialog.close();
                });
                
                that._getTimelineSet();
                that._setTimelineDtBusy(false);
                
                },
                error: function(oError){
                MessageBox.show("Error");
                that._setTimelineDtBusy(false);
                
                }
                });
            }

        });
    });
