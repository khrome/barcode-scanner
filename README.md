barcode-scanner.js
==================
A utility for Scanning barcodes supporting HID or serial drivers(and eventually wedge)

This was built and tested against [this scanner](https://www.amazon.com/NETUM-Bluetooth-Handheld-Wireless-NT-1228BL/dp/B07CBS52KJ/), but it should work for many.

It was originally built and tested against [this scanner](https://www.amazon.com/gp/product/B00Y83TXOE/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=khrome-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B00Y83TXOE&linkId=6d3e5fee052ba6406daf2379db13c971), but it is no longer compatible with OS X.



Usage
-----

require the library

    var BarcodeScanner = require('barcode-scanner');

If you have a serial or HID scanner:

    BarcodeScanner.listen({
        path : '<path of your serial or HID scanner>'
    }, function(barcode){
        // do stuff
    });

Additionally you can refer to your HID scanner with product and vendor ids:

    BarcodeScanner.listen({
        product : '<product id of your HID scanner>',
        vendor : '<vendor id of your HID scanner>',
    }, function(barcode){
        // do stuff
    });

As a note, some OSs require signing to access your drivers (like OS X + Electron), you'll need to have that done in order to connect to them.

CommandLine
-----------
You can use the `barc` command to query individual scanners connected to your machine and to monitor them for input both to understand the state of your machine or to troubleshoot connectivity issues (Probe does not work on OS X, unless you are running in a context that already has rights to, but `probe-all` continues to work).

- `barc probe-all` will list all connected devices
- `barc probe -r <serial-scanner-id>` will directly monitor a device for input
- `barc probe -i <HID-scanner-id>` will directly monitor a device for input
- `barc demo -r <serial-scanner-id> -d <aws_id> -s <aws_secret> -t <aws_tag>` will run a demo that fetches UPC/EAN info from amazon interactively for scanned barcodes



Testing
-------
Tests use mocha/should to execute the tests from root

    mocha

If you find any rough edges, please submit a bug!

Enjoy,

-Abbey Hawk Sparrow
