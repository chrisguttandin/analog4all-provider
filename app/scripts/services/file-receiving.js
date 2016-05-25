class FileReceivingService {

    constructor (fileReceiverFactoryService) {
        this._fileReceiverFactoryService = fileReceiverFactoryService;
    }

    receive (channelBroker) {
        var errorSubscription,
            fileReceiver,
            messageSubscription;

        fileReceiver = this._fileReceiverFactoryService.create({
            channelBroker
        });

        errorSubscription = channelBroker.addErrorHandler(::fileReceiver.fail);
        messageSubscription = channelBroker.addMessageHandler(::fileReceiver.receive);

        return new Promise(function (resolve, reject) {
            fileReceiver.on('done', function (err, file) {
                errorSubscription.cancel();
                messageSubscription.cancel();

                if (err === null) {
                    resolve(file);
                } else {
                    reject(err);
                }
            });
        });
    }

}

module.exports = FileReceivingService;
