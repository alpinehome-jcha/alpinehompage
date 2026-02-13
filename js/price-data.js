const initialPriceData = [
    {
        "category": "master",
        "productCategory": "F#1 Status",
        "product": "Alpine F#1 Status Full System",
        "msrp": 45000000,
        "distPrice": 18000000,
        "dealerPrice": 27000000
    },
    {
        "category": "team",
        "productCategory": "F#1 Status",
        "product": "Alpine F#1 Status Full System",
        "msrp": 45000000,
        "distPrice": "-",
        "dealerPrice": 27000000
    },
    {
        "category": "style",
        "productCategory": "F#1 Status",
        "product": "Alpine F#1 Status Full System",
        "msrp": 45000000,
        "distPrice": 22500000,
        "dealerPrice": 27000000
    },
    {
        "category": "region",
        "productCategory": "F#1 Status",
        "product": "Alpine F#1 Status Full System",
        "msrp": 45000000,
        "distPrice": 22500000,
        "dealerPrice": 27000000
    },
    {
        "category": "dealer",
        "productCategory": "F#1 Status",
        "product": "Alpine F#1 Status Full System",
        "msrp": 45000000,
        "distPrice": "-",
        "dealerPrice": 27000000
    },
    {
        "category": "master",
        "productCategory": "F#1 Status",
        "product": "F#1 12V Full Package",
        "msrp": 29000000,
        "distPrice": 11600000,
        "dealerPrice": 17400000
    },
    {
        "category": "master",
        "productCategory": "F#1 Status",
        "product": "F#1 3Way Speaker Package",
        "msrp": 16000000,
        "distPrice": 6400000,
        "dealerPrice": 9600000
    },
    {
        "category": "master",
        "productCategory": "F#1 Status",
        "product": "F#1 Subwoofer",
        "msrp": 5000000,
        "distPrice": 2000000,
        "dealerPrice": 3000000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDS-990",
        "msrp": 2990000,
        "distPrice": 1196000,
        "dealerPrice": 1794000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDS-990",
        "msrp": 2990000,
        "distPrice": "-",
        "dealerPrice": 1794000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDS-990",
        "msrp": 2990000,
        "distPrice": 1495000,
        "dealerPrice": 1794000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDS-990",
        "msrp": 2990000,
        "distPrice": 1495000,
        "dealerPrice": 1794000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDS-990",
        "msrp": 2990000,
        "distPrice": "-",
        "dealerPrice": 1794000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDP-D90",
        "msrp": 4300000,
        "distPrice": 1720000,
        "dealerPrice": 2580000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDP-D90",
        "msrp": 4300000,
        "distPrice": "-",
        "dealerPrice": 2580000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDP-D90",
        "msrp": 4300000,
        "distPrice": 2150000,
        "dealerPrice": 2580000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDP-D90",
        "msrp": 4300000,
        "distPrice": 2150000,
        "dealerPrice": 2580000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDP-D90",
        "msrp": 4300000,
        "distPrice": "-",
        "dealerPrice": 2580000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "RUX-C810",
        "msrp": 200000,
        "distPrice": 80000,
        "dealerPrice": 120000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "RUX-C810",
        "msrp": 200000,
        "distPrice": "-",
        "dealerPrice": 120000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "RUX-C810",
        "msrp": 200000,
        "distPrice": 100000,
        "dealerPrice": 120000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "RUX-C810",
        "msrp": 200000,
        "distPrice": 100000,
        "dealerPrice": 120000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "RUX-C810",
        "msrp": 200000,
        "distPrice": "-",
        "dealerPrice": 120000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-653",
        "msrp": 1980000,
        "distPrice": 792000,
        "dealerPrice": 1188000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-653",
        "msrp": 1980000,
        "distPrice": "-",
        "dealerPrice": 1188000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-653",
        "msrp": 1980000,
        "distPrice": 990000,
        "dealerPrice": 1188000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-653",
        "msrp": 1980000,
        "distPrice": 990000,
        "dealerPrice": 1188000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-653",
        "msrp": 1980000,
        "distPrice": "-",
        "dealerPrice": 1188000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-653S",
        "msrp": 1980000,
        "distPrice": 792000,
        "dealerPrice": 1188000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-653S",
        "msrp": 1980000,
        "distPrice": "-",
        "dealerPrice": 1188000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-653S",
        "msrp": 1980000,
        "distPrice": 990000,
        "dealerPrice": 1188000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-653S",
        "msrp": 1980000,
        "distPrice": 990000,
        "dealerPrice": 1188000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-653S",
        "msrp": 1980000,
        "distPrice": "-",
        "dealerPrice": 1188000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-65C",
        "msrp": 1600000,
        "distPrice": 640000,
        "dealerPrice": 960000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-65C",
        "msrp": 1600000,
        "distPrice": "-",
        "dealerPrice": 960000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-65C",
        "msrp": 1600000,
        "distPrice": 800000,
        "dealerPrice": 960000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-65C",
        "msrp": 1600000,
        "distPrice": 800000,
        "dealerPrice": 960000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-65C",
        "msrp": 1600000,
        "distPrice": "-",
        "dealerPrice": 960000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-65",
        "msrp": 1010000,
        "distPrice": 404000,
        "dealerPrice": 606000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-65",
        "msrp": 1010000,
        "distPrice": "-",
        "dealerPrice": 606000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-65",
        "msrp": 1010000,
        "distPrice": 505000,
        "dealerPrice": 606000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-65",
        "msrp": 1010000,
        "distPrice": 505000,
        "dealerPrice": 606000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-65",
        "msrp": 1010000,
        "distPrice": "-",
        "dealerPrice": 606000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-W10",
        "msrp": 1300000,
        "distPrice": 520000,
        "dealerPrice": 780000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-W10",
        "msrp": 1300000,
        "distPrice": "-",
        "dealerPrice": 780000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-W10",
        "msrp": 1300000,
        "distPrice": 650000,
        "dealerPrice": 780000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-W10",
        "msrp": 1300000,
        "distPrice": 650000,
        "dealerPrice": 780000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-W10",
        "msrp": 1300000,
        "distPrice": "-",
        "dealerPrice": 780000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDA-F60",
        "msrp": 1800000,
        "distPrice": 720000,
        "dealerPrice": 1080000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDA-F60",
        "msrp": 1800000,
        "distPrice": "-",
        "dealerPrice": 1080000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDA-F60",
        "msrp": 1800000,
        "distPrice": 900000,
        "dealerPrice": 1080000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDA-F60",
        "msrp": 1800000,
        "distPrice": 900000,
        "dealerPrice": 1080000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDA-F60",
        "msrp": 1800000,
        "distPrice": "-",
        "dealerPrice": 1080000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-TWEETER(Custom fit)",
        "msrp": 700000,
        "distPrice": 280000,
        "dealerPrice": 420000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-Midrange",
        "msrp": 850000,
        "distPrice": 340000,
        "dealerPrice": 510000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "HDZ-MidWoofer",
        "msrp": 1200000,
        "distPrice": 480000,
        "dealerPrice": 720000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-M60-4",
        "msrp": 750000,
        "distPrice": 225000,
        "dealerPrice": 262500
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-M60-4",
        "msrp": 750000,
        "distPrice": "-",
        "dealerPrice": 262500
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-M60-4",
        "msrp": 750000,
        "distPrice": 225000,
        "dealerPrice": 262500
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-M60-4",
        "msrp": 750000,
        "distPrice": 225000,
        "dealerPrice": 262500
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-M60-4",
        "msrp": 750000,
        "distPrice": "-",
        "dealerPrice": 262500
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-R80-8",
        "msrp": 1100000,
        "distPrice": 440000,
        "dealerPrice": 660000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-R80-8",
        "msrp": 1100000,
        "distPrice": "-",
        "dealerPrice": 660000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-R80-8",
        "msrp": 1100000,
        "distPrice": 550000,
        "dealerPrice": 660000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-R80-8",
        "msrp": 1100000,
        "distPrice": 550000,
        "dealerPrice": 660000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-R80-8",
        "msrp": 1100000,
        "distPrice": "-",
        "dealerPrice": 660000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-R100-8",
        "msrp": 1300000,
        "distPrice": 520000,
        "dealerPrice": 780000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-R100-8",
        "msrp": 1300000,
        "distPrice": "-",
        "dealerPrice": 780000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-R100-8",
        "msrp": 1300000,
        "distPrice": 650000,
        "dealerPrice": 780000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-R100-8",
        "msrp": 1300000,
        "distPrice": 650000,
        "dealerPrice": 780000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-R100-8",
        "msrp": 1300000,
        "distPrice": "-",
        "dealerPrice": 780000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-8",
        "msrp": 1600000,
        "distPrice": 640000,
        "dealerPrice": 960000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-8",
        "msrp": 1600000,
        "distPrice": "-",
        "dealerPrice": 960000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-8",
        "msrp": 1600000,
        "distPrice": 800000,
        "dealerPrice": 960000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-8",
        "msrp": 1600000,
        "distPrice": 800000,
        "dealerPrice": 960000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-8",
        "msrp": 1600000,
        "distPrice": "-",
        "dealerPrice": 960000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-10DP",
        "msrp": 1900000,
        "distPrice": 760000,
        "dealerPrice": 1140000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-10DP",
        "msrp": 1900000,
        "distPrice": "-",
        "dealerPrice": 1140000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-10DP",
        "msrp": 1900000,
        "distPrice": 950000,
        "dealerPrice": 1140000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-10DP",
        "msrp": 1900000,
        "distPrice": 950000,
        "dealerPrice": 1140000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-X120-10DP",
        "msrp": 1900000,
        "distPrice": "-",
        "dealerPrice": 1140000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EX",
        "msrp": 2300000,
        "distPrice": 920000,
        "dealerPrice": 1380000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EX",
        "msrp": 2300000,
        "distPrice": "-",
        "dealerPrice": 1380000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EX",
        "msrp": 2300000,
        "distPrice": 1150000,
        "dealerPrice": 1380000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EX",
        "msrp": 2300000,
        "distPrice": 1150000,
        "dealerPrice": 1380000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EX",
        "msrp": 2300000,
        "distPrice": "-",
        "dealerPrice": 1380000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EV x 2",
        "msrp": 4750000,
        "distPrice": 1900000,
        "dealerPrice": 2850000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EV x 2",
        "msrp": 4750000,
        "distPrice": "-",
        "dealerPrice": 2850000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EV x 2",
        "msrp": 4750000,
        "distPrice": 2375000,
        "dealerPrice": 2850000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EV x 2",
        "msrp": 4750000,
        "distPrice": 2375000,
        "dealerPrice": 2850000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-X121-12EV x 2",
        "msrp": 4750000,
        "distPrice": "-",
        "dealerPrice": 2850000
    },
    {
        "category": "master",
        "productCategory": "Alpine Status",
        "product": "KTX-990",
        "msrp": 70000,
        "distPrice": 28000,
        "dealerPrice": 42000
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "KTX-990",
        "msrp": 70000,
        "distPrice": "-",
        "dealerPrice": 42000
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "KTX-990",
        "msrp": 70000,
        "distPrice": 35000,
        "dealerPrice": 42000
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "KTX-990",
        "msrp": 70000,
        "distPrice": 35000,
        "dealerPrice": 42000
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "KTX-990",
        "msrp": 70000,
        "distPrice": "-",
        "dealerPrice": 42000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PXE-C80-88",
        "msrp": 1800000,
        "distPrice": 720000,
        "dealerPrice": 1080000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PXE-C80-88",
        "msrp": 1800000,
        "distPrice": "-",
        "dealerPrice": 1080000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PXE-C80-88",
        "msrp": 1800000,
        "distPrice": 900000,
        "dealerPrice": 1080000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PXE-C80-88",
        "msrp": 1800000,
        "distPrice": 900000,
        "dealerPrice": 1080000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PXE-C80-88",
        "msrp": 1800000,
        "distPrice": "-",
        "dealerPrice": 1080000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "R2-A60F",
        "msrp": 750000,
        "distPrice": 300000,
        "dealerPrice": 450000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "R2-A60F",
        "msrp": 750000,
        "distPrice": "-",
        "dealerPrice": 450000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "R2-A60F",
        "msrp": 750000,
        "distPrice": 375000,
        "dealerPrice": 450000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "R2-A60F",
        "msrp": 750000,
        "distPrice": 375000,
        "dealerPrice": 450000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "R2-A60F",
        "msrp": 750000,
        "distPrice": "-",
        "dealerPrice": 450000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "S2-A60M",
        "msrp": 700000,
        "distPrice": 280000,
        "dealerPrice": 420000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "S2-A60M",
        "msrp": 700000,
        "distPrice": "-",
        "dealerPrice": 420000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "S2-A60M",
        "msrp": 700000,
        "distPrice": 350000,
        "dealerPrice": 420000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "S2-A60M",
        "msrp": 700000,
        "distPrice": 350000,
        "dealerPrice": 420000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "S2-A60M",
        "msrp": 700000,
        "distPrice": "-",
        "dealerPrice": 420000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PWE-M770",
        "msrp": 360000,
        "distPrice": 162000,
        "dealerPrice": 234000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PWE-M770",
        "msrp": 360000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PWE-M770",
        "msrp": 360000,
        "distPrice": 162000,
        "dealerPrice": 245000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PWE-M770",
        "msrp": 360000,
        "distPrice": 198000,
        "dealerPrice": 234000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PWE-M770",
        "msrp": 360000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "master",
        "productCategory": "DSP/AMP",
        "product": "PWE-770-RCU",
        "msrp": 40000,
        "distPrice": 16000,
        "dealerPrice": 24000
    },
    {
        "category": "team",
        "productCategory": "DSP/AMP",
        "product": "PWE-770-RCU",
        "msrp": 40000,
        "distPrice": "-",
        "dealerPrice": 24000
    },
    {
        "category": "style",
        "productCategory": "DSP/AMP",
        "product": "PWE-770-RCU",
        "msrp": 40000,
        "distPrice": 20000,
        "dealerPrice": 25000
    },
    {
        "category": "region",
        "productCategory": "DSP/AMP",
        "product": "PWE-770-RCU",
        "msrp": 40000,
        "distPrice": 20000,
        "dealerPrice": 24000
    },
    {
        "category": "dealer",
        "productCategory": "DSP/AMP",
        "product": "PWE-770-RCU",
        "msrp": 40000,
        "distPrice": "-",
        "dealerPrice": 24000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "R2-S653",
        "msrp": 1060000,
        "distPrice": 424000,
        "dealerPrice": 636000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "R2-S653",
        "msrp": 1060000,
        "distPrice": "-",
        "dealerPrice": 636000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "R2-S653",
        "msrp": 1060000,
        "distPrice": 530000,
        "dealerPrice": 636000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "R2-S653",
        "msrp": 1060000,
        "distPrice": 530000,
        "dealerPrice": 636000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "R2-S653",
        "msrp": 1060000,
        "distPrice": "-",
        "dealerPrice": 636000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-653",
        "msrp": 800000,
        "distPrice": 320000,
        "dealerPrice": 480000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-653",
        "msrp": 800000,
        "distPrice": "-",
        "dealerPrice": 480000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-653",
        "msrp": 800000,
        "distPrice": 400000,
        "dealerPrice": 480000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-653",
        "msrp": 800000,
        "distPrice": 400000,
        "dealerPrice": 480000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-653",
        "msrp": 800000,
        "distPrice": "-",
        "dealerPrice": 480000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-653NW",
        "msrp": 290000,
        "distPrice": 116000,
        "dealerPrice": 174000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-653NW",
        "msrp": 290000,
        "distPrice": "-",
        "dealerPrice": 174000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-653NW",
        "msrp": 290000,
        "distPrice": 145000,
        "dealerPrice": 174000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-653NW",
        "msrp": 290000,
        "distPrice": 145000,
        "dealerPrice": 174000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-653NW",
        "msrp": 290000,
        "distPrice": "-",
        "dealerPrice": 174000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-65C",
        "msrp": 740000,
        "distPrice": 296000,
        "dealerPrice": 444000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-65C",
        "msrp": 740000,
        "distPrice": "-",
        "dealerPrice": 444000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-65C",
        "msrp": 740000,
        "distPrice": 370000,
        "dealerPrice": 444000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-65C",
        "msrp": 740000,
        "distPrice": 370000,
        "dealerPrice": 444000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-65C",
        "msrp": 740000,
        "distPrice": "-",
        "dealerPrice": 444000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-35M",
        "msrp": 280000,
        "distPrice": 112000,
        "dealerPrice": 168000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-35M",
        "msrp": 280000,
        "distPrice": "-",
        "dealerPrice": 168000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-35M",
        "msrp": 280000,
        "distPrice": 140000,
        "dealerPrice": 168000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-35M",
        "msrp": 280000,
        "distPrice": 140000,
        "dealerPrice": 168000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-35M",
        "msrp": 280000,
        "distPrice": "-",
        "dealerPrice": 168000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-S65C",
        "msrp": 270000,
        "distPrice": 108000,
        "dealerPrice": 162000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-S65C",
        "msrp": 270000,
        "distPrice": "-",
        "dealerPrice": 162000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-S65C",
        "msrp": 270000,
        "distPrice": 135000,
        "dealerPrice": 162000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-S65C",
        "msrp": 270000,
        "distPrice": 135000,
        "dealerPrice": 162000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-S65C",
        "msrp": 270000,
        "distPrice": "-",
        "dealerPrice": 162000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-S65",
        "msrp": 230000,
        "distPrice": 92000,
        "dealerPrice": 138000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-S65",
        "msrp": 230000,
        "distPrice": "-",
        "dealerPrice": 138000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-S65",
        "msrp": 230000,
        "distPrice": 115000,
        "dealerPrice": 138000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-S65",
        "msrp": 230000,
        "distPrice": 115000,
        "dealerPrice": 138000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-S65",
        "msrp": 230000,
        "distPrice": "-",
        "dealerPrice": 138000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-A10TW",
        "msrp": 150000,
        "distPrice": 60000,
        "dealerPrice": 90000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-A10TW",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-A10TW",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-A10TW",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-A10TW",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DM-65C",
        "msrp": 200000,
        "distPrice": 80000,
        "dealerPrice": 120000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DM-65C",
        "msrp": 200000,
        "distPrice": "-",
        "dealerPrice": 120000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DM-65C",
        "msrp": 200000,
        "distPrice": 100000,
        "dealerPrice": 120000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DM-65C",
        "msrp": 200000,
        "distPrice": 100000,
        "dealerPrice": 120000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DM-65C",
        "msrp": 200000,
        "distPrice": "-",
        "dealerPrice": 120000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DM-65",
        "msrp": 150000,
        "distPrice": 60000,
        "dealerPrice": 90000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DM-65",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DM-65",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DM-65",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DM-65",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "RS-W10D2",
        "msrp": 1500000,
        "distPrice": 600000,
        "dealerPrice": 900000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "RS-W10D2",
        "msrp": 1500000,
        "distPrice": "-",
        "dealerPrice": 900000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "RS-W10D2",
        "msrp": 1500000,
        "distPrice": 750000,
        "dealerPrice": 900000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "RS-W10D2",
        "msrp": 1500000,
        "distPrice": 750000,
        "dealerPrice": 900000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "RS-W10D2",
        "msrp": 1500000,
        "distPrice": "-",
        "dealerPrice": 900000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-W12D2",
        "msrp": 500000,
        "distPrice": 200000,
        "dealerPrice": 300000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-W12D2",
        "msrp": 500000,
        "distPrice": "-",
        "dealerPrice": 300000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-W12D2",
        "msrp": 500000,
        "distPrice": 250000,
        "dealerPrice": 300000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-W12D2",
        "msrp": 500000,
        "distPrice": 250000,
        "dealerPrice": 300000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-W12D2",
        "msrp": 500000,
        "distPrice": "-",
        "dealerPrice": 300000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-W10D2",
        "msrp": 450000,
        "distPrice": 180000,
        "dealerPrice": 270000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-W10D2",
        "msrp": 450000,
        "distPrice": "-",
        "dealerPrice": 270000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-W10D2",
        "msrp": 450000,
        "distPrice": 225000,
        "dealerPrice": 270000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-W10D2",
        "msrp": 450000,
        "distPrice": 225000,
        "dealerPrice": 270000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-W10D2",
        "msrp": 450000,
        "distPrice": "-",
        "dealerPrice": 270000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-W8D4",
        "msrp": 360000,
        "distPrice": 144000,
        "dealerPrice": 216000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-W8D4",
        "msrp": 360000,
        "distPrice": "-",
        "dealerPrice": 216000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-W8D4",
        "msrp": 360000,
        "distPrice": 180000,
        "dealerPrice": 216000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-W8D4",
        "msrp": 360000,
        "distPrice": 180000,
        "dealerPrice": 216000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-W8D4",
        "msrp": 360000,
        "distPrice": "-",
        "dealerPrice": 216000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "RS-W10D2 (외장박스 포함)",
        "msrp": 1820000,
        "distPrice": 728000,
        "dealerPrice": 1092000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "RS-W10D2 (외장박스 포함)",
        "msrp": 1820000,
        "distPrice": "-",
        "dealerPrice": 1092000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "RS-W10D2 (외장박스 포함)",
        "msrp": 1820000,
        "distPrice": 910000,
        "dealerPrice": 1092000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "RS-W10D2 (외장박스 포함)",
        "msrp": 1820000,
        "distPrice": 910000,
        "dealerPrice": 1092000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "RS-W10D2 (외장박스 포함)",
        "msrp": 1820000,
        "distPrice": "-",
        "dealerPrice": 1092000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-W12D2 (외장박스 포함)",
        "msrp": 850000,
        "distPrice": 340000,
        "dealerPrice": 510000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-W12D2 (외장박스 포함)",
        "msrp": 850000,
        "distPrice": "-",
        "dealerPrice": 510000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-W12D2 (외장박스 포함)",
        "msrp": 850000,
        "distPrice": 425000,
        "dealerPrice": 510000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-W12D2 (외장박스 포함)",
        "msrp": 850000,
        "distPrice": 425000,
        "dealerPrice": 510000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-W12D2 (외장박스 포함)",
        "msrp": 850000,
        "distPrice": "-",
        "dealerPrice": 510000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-W10D2 (외장박스 포함)",
        "msrp": 770000,
        "distPrice": 308000,
        "dealerPrice": 462000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-W10D2 (외장박스 포함)",
        "msrp": 770000,
        "distPrice": "-",
        "dealerPrice": 462000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-W10D2 (외장박스 포함)",
        "msrp": 770000,
        "distPrice": 385000,
        "dealerPrice": 462000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-W10D2 (외장박스 포함)",
        "msrp": 770000,
        "distPrice": 385000,
        "dealerPrice": 462000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-W10D2 (외장박스 포함)",
        "msrp": 770000,
        "distPrice": "-",
        "dealerPrice": 462000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "S2-W8D4 (외장박스 포함)",
        "msrp": 670000,
        "distPrice": 268000,
        "dealerPrice": 402000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "S2-W8D4 (외장박스 포함)",
        "msrp": 670000,
        "distPrice": "-",
        "dealerPrice": 402000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "S2-W8D4 (외장박스 포함)",
        "msrp": 670000,
        "distPrice": 335000,
        "dealerPrice": 402000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "S2-W8D4 (외장박스 포함)",
        "msrp": 670000,
        "distPrice": 335000,
        "dealerPrice": 402000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "S2-W8D4 (외장박스 포함)",
        "msrp": 670000,
        "distPrice": "-",
        "dealerPrice": 402000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DPS-25M",
        "msrp": 250000,
        "distPrice": 75000,
        "dealerPrice": 75000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DPS-25M",
        "msrp": 250000,
        "distPrice": "-",
        "dealerPrice": 75000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DPS-25M",
        "msrp": 250000,
        "distPrice": 75000,
        "dealerPrice": 75000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DPS-25M",
        "msrp": 250000,
        "distPrice": 75000,
        "dealerPrice": 75000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DPS-25M",
        "msrp": 250000,
        "distPrice": "-",
        "dealerPrice": 150000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "EV-65CF",
        "msrp": 380000,
        "distPrice": 152000,
        "dealerPrice": 228000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "EV-65CF",
        "msrp": 380000,
        "distPrice": "-",
        "dealerPrice": 228000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "EV-65CF",
        "msrp": 380000,
        "distPrice": 178600,
        "dealerPrice": 228000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "EV-65CF",
        "msrp": 380000,
        "distPrice": 190000,
        "dealerPrice": 228000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "EV-65CF",
        "msrp": 380000,
        "distPrice": "-",
        "dealerPrice": 228000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "EV-65CF-Converter P",
        "msrp": 30000,
        "distPrice": 12000,
        "dealerPrice": 18000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "EV-65CF-Converter P",
        "msrp": 30000,
        "distPrice": "-",
        "dealerPrice": 18000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "EV-65CF-Converter P",
        "msrp": 30000,
        "distPrice": 14100,
        "dealerPrice": 18000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "EV-65CF-Converter P",
        "msrp": 30000,
        "distPrice": 15000,
        "dealerPrice": 18000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "EV-65CF-Converter P",
        "msrp": 30000,
        "distPrice": "-",
        "dealerPrice": 18000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "EV-40M-T",
        "msrp": 560000,
        "distPrice": 224000,
        "dealerPrice": 336000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "EV-40M-T",
        "msrp": 560000,
        "distPrice": "-",
        "dealerPrice": 336000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "EV-40M-T",
        "msrp": 560000,
        "distPrice": 263200,
        "dealerPrice": 336000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "EV-40M-T",
        "msrp": 560000,
        "distPrice": 280000,
        "dealerPrice": 336000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "EV-40M-T",
        "msrp": 560000,
        "distPrice": "-",
        "dealerPrice": 336000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "EV-40MR-T",
        "msrp": 320000,
        "distPrice": 128000,
        "dealerPrice": 192000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "EV-40MR-T",
        "msrp": 320000,
        "distPrice": "-",
        "dealerPrice": 192000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "EV-40MR-T",
        "msrp": 320000,
        "distPrice": 150400,
        "dealerPrice": 192000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "EV-40MR-T",
        "msrp": 320000,
        "distPrice": 160000,
        "dealerPrice": 192000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "EV-40MR-T",
        "msrp": 320000,
        "distPrice": "-",
        "dealerPrice": 192000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "EV-100SW 3",
        "msrp": 660000,
        "distPrice": 264000,
        "dealerPrice": 396000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "EV-100SW 3",
        "msrp": 660000,
        "distPrice": "-",
        "dealerPrice": 396000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "EV-100SW 3",
        "msrp": 660000,
        "distPrice": 310200,
        "dealerPrice": 396000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "EV-100SW 3",
        "msrp": 660000,
        "distPrice": 330000,
        "dealerPrice": 396000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "EV-100SW 3",
        "msrp": 660000,
        "distPrice": "-",
        "dealerPrice": 396000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "EV-100SW Y",
        "msrp": 660000,
        "distPrice": 264000,
        "dealerPrice": 396000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "EV-100SW Y",
        "msrp": 660000,
        "distPrice": "-",
        "dealerPrice": 396000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "EV-100SW Y",
        "msrp": 660000,
        "distPrice": 310200,
        "dealerPrice": 396000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "EV-100SW Y",
        "msrp": 660000,
        "distPrice": 330000,
        "dealerPrice": 396000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "EV-100SW Y",
        "msrp": 660000,
        "distPrice": "-",
        "dealerPrice": 396000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-45C-B",
        "msrp": 720000,
        "distPrice": 288000,
        "dealerPrice": 432000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-45C-B",
        "msrp": 720000,
        "distPrice": "-",
        "dealerPrice": 432000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-45C-B",
        "msrp": 720000,
        "distPrice": 360000,
        "dealerPrice": 432000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-45C-B",
        "msrp": 720000,
        "distPrice": 360000,
        "dealerPrice": 432000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-45C-B",
        "msrp": 720000,
        "distPrice": "-",
        "dealerPrice": 432000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-45-B",
        "msrp": 630000,
        "distPrice": 252000,
        "dealerPrice": 378000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-45-B",
        "msrp": 630000,
        "distPrice": "-",
        "dealerPrice": 378000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-45-B",
        "msrp": 630000,
        "distPrice": 315000,
        "dealerPrice": 378000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-45-B",
        "msrp": 630000,
        "distPrice": 315000,
        "dealerPrice": 378000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-45-B",
        "msrp": 630000,
        "distPrice": "-",
        "dealerPrice": 378000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-40C-B",
        "msrp": 720000,
        "distPrice": 288000,
        "dealerPrice": 432000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-40C-B",
        "msrp": 720000,
        "distPrice": "-",
        "dealerPrice": 432000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-40C-B",
        "msrp": 720000,
        "distPrice": 360000,
        "dealerPrice": 432000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-40C-B",
        "msrp": 720000,
        "distPrice": 360000,
        "dealerPrice": 432000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-40C-B",
        "msrp": 720000,
        "distPrice": "-",
        "dealerPrice": 432000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-15TW-B",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-15TW-B",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-15TW-B",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-15TW-B",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-15TW-B",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "Speakers",
        "product": "DP2-80WF-B",
        "msrp": 990000,
        "distPrice": 396000,
        "dealerPrice": 594000
    },
    {
        "category": "team",
        "productCategory": "Speakers",
        "product": "DP2-80WF-B",
        "msrp": 990000,
        "distPrice": "-",
        "dealerPrice": 594000
    },
    {
        "category": "style",
        "productCategory": "Speakers",
        "product": "DP2-80WF-B",
        "msrp": 990000,
        "distPrice": 495000,
        "dealerPrice": 594000
    },
    {
        "category": "region",
        "productCategory": "Speakers",
        "product": "DP2-80WF-B",
        "msrp": 990000,
        "distPrice": 495000,
        "dealerPrice": 594000
    },
    {
        "category": "dealer",
        "productCategory": "Speakers",
        "product": "DP2-80WF-B",
        "msrp": 990000,
        "distPrice": "-",
        "dealerPrice": 594000
    },
    {
        "category": "master",
        "productCategory": "기타상품",
        "product": "UTS-A100",
        "msrp": 600000,
        "distPrice": 420000,
        "dealerPrice": 480000
    },
    {
        "category": "team",
        "productCategory": "기타상품",
        "product": "UTS-A100",
        "msrp": 600000,
        "distPrice": "-",
        "dealerPrice": 480000
    },
    {
        "category": "style",
        "productCategory": "기타상품",
        "product": "UTS-A100",
        "msrp": 600000,
        "distPrice": 450000,
        "dealerPrice": 480000
    },
    {
        "category": "region",
        "productCategory": "기타상품",
        "product": "UTS-A100",
        "msrp": 600000,
        "distPrice": 450000,
        "dealerPrice": 480000
    },
    {
        "category": "dealer",
        "productCategory": "기타상품",
        "product": "UTS-A100",
        "msrp": 600000,
        "distPrice": "-",
        "dealerPrice": 480000
    },
    {
        "category": "master",
        "productCategory": "ALPINESTYLE",
        "product": "DVR-DM1000KO-IC",
        "msrp": 800000,
        "distPrice": 490000,
        "dealerPrice": 620000
    },
    {
        "category": "team",
        "productCategory": "ALPINESTYLE",
        "product": "DVR-DM1000KO-IC",
        "msrp": 800000,
        "distPrice": "-",
        "dealerPrice": 620000
    },
    {
        "category": "style",
        "productCategory": "ALPINESTYLE",
        "product": "DVR-DM1000KO-IC",
        "msrp": 800000,
        "distPrice": 490000,
        "dealerPrice": 620000
    },
    {
        "category": "region",
        "productCategory": "ALPINESTYLE",
        "product": "DVR-DM1000KO-IC",
        "msrp": 800000,
        "distPrice": 490000,
        "dealerPrice": 620000
    },
    {
        "category": "dealer",
        "productCategory": "ALPINESTYLE",
        "product": "DVR-DM1000KO-IC",
        "msrp": 800000,
        "distPrice": "-",
        "dealerPrice": 620000
    },
    {
        "category": "master",
        "productCategory": "ALPINESTYLE",
        "product": "MS-165-KO-WH",
        "msrp": 850000,
        "distPrice": 500000,
        "dealerPrice": 600000
    },
    {
        "category": "team",
        "productCategory": "ALPINESTYLE",
        "product": "MS-165-KO-WH",
        "msrp": 850000,
        "distPrice": "-",
        "dealerPrice": 600000
    },
    {
        "category": "style",
        "productCategory": "ALPINESTYLE",
        "product": "MS-165-KO-WH",
        "msrp": 850000,
        "distPrice": 500000,
        "dealerPrice": 600000
    },
    {
        "category": "region",
        "productCategory": "ALPINESTYLE",
        "product": "MS-165-KO-WH",
        "msrp": 850000,
        "distPrice": 500000,
        "dealerPrice": 600000
    },
    {
        "category": "dealer",
        "productCategory": "ALPINESTYLE",
        "product": "MS-165-KO-WH",
        "msrp": 850000,
        "distPrice": "-",
        "dealerPrice": 600000
    },
    {
        "category": "master",
        "productCategory": "기타상품",
        "product": "Status Tweeter Chamber",
        "msrp": 240000,
        "distPrice": 144000,
        "dealerPrice": 144000
    },
    {
        "category": "team",
        "productCategory": "기타상품",
        "product": "Status Tweeter Chamber",
        "msrp": 240000,
        "distPrice": "-",
        "dealerPrice": 144000
    },
    {
        "category": "style",
        "productCategory": "기타상품",
        "product": "Status Tweeter Chamber",
        "msrp": 240000,
        "distPrice": 144000,
        "dealerPrice": 144000
    },
    {
        "category": "region",
        "productCategory": "기타상품",
        "product": "Status Tweeter Chamber",
        "msrp": 240000,
        "distPrice": 144000,
        "dealerPrice": 144000
    },
    {
        "category": "dealer",
        "productCategory": "기타상품",
        "product": "Status Tweeter Chamber",
        "msrp": 240000,
        "distPrice": "-",
        "dealerPrice": 144000
    },
    {
        "category": "master",
        "productCategory": "기타상품",
        "product": "현대/기아 6.5\" 배플",
        "msrp": 50000,
        "distPrice": 20000,
        "dealerPrice": 30000
    },
    {
        "category": "team",
        "productCategory": "기타상품",
        "product": "현대/기아 6.5\" 배플",
        "msrp": 50000,
        "distPrice": "-",
        "dealerPrice": 30000
    },
    {
        "category": "style",
        "productCategory": "기타상품",
        "product": "현대/기아 6.5\" 배플",
        "msrp": 50000,
        "distPrice": 25000,
        "dealerPrice": 30000
    },
    {
        "category": "region",
        "productCategory": "기타상품",
        "product": "현대/기아 6.5\" 배플",
        "msrp": 50000,
        "distPrice": 25000,
        "dealerPrice": 30000
    },
    {
        "category": "dealer",
        "productCategory": "기타상품",
        "product": "현대/기아 6.5\" 배플",
        "msrp": 50000,
        "distPrice": "-",
        "dealerPrice": 30000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-101 / HK-102 / HK-103",
        "msrp": 90000,
        "distPrice": 36000,
        "dealerPrice": 54000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-101 / HK-102 / HK-103",
        "msrp": 90000,
        "distPrice": "-",
        "dealerPrice": 54000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-101 / HK-102 / HK-103",
        "msrp": 90000,
        "distPrice": 45000,
        "dealerPrice": 54000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-101 / HK-102 / HK-103",
        "msrp": 90000,
        "distPrice": 45000,
        "dealerPrice": 54000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-101 / HK-102 / HK-103",
        "msrp": 90000,
        "distPrice": "-",
        "dealerPrice": 54000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-104",
        "msrp": 150000,
        "distPrice": 60000,
        "dealerPrice": 90000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-104",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-104",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-104",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-104",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-106",
        "msrp": 150000,
        "distPrice": 60000,
        "dealerPrice": 90000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-106",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-106",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-106",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-106",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-107",
        "msrp": 150000,
        "distPrice": 60000,
        "dealerPrice": 90000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-107",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-107",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-107",
        "msrp": 150000,
        "distPrice": 75000,
        "dealerPrice": 90000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-107",
        "msrp": 150000,
        "distPrice": "-",
        "dealerPrice": 90000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-1A",
        "msrp": 155000,
        "distPrice": 62000,
        "dealerPrice": 93000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-1A",
        "msrp": 155000,
        "distPrice": "-",
        "dealerPrice": 93000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-1A",
        "msrp": 155000,
        "distPrice": 77500,
        "dealerPrice": 93000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-1A",
        "msrp": 155000,
        "distPrice": 77500,
        "dealerPrice": 93000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-1A",
        "msrp": 155000,
        "distPrice": "-",
        "dealerPrice": 93000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-2A",
        "msrp": 120000,
        "distPrice": 48000,
        "dealerPrice": 72000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-2A",
        "msrp": 120000,
        "distPrice": "-",
        "dealerPrice": 72000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-2A",
        "msrp": 120000,
        "distPrice": 60000,
        "dealerPrice": 72000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-2A",
        "msrp": 120000,
        "distPrice": 60000,
        "dealerPrice": 72000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-2A",
        "msrp": 120000,
        "distPrice": "-",
        "dealerPrice": 72000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-12A / HK-13A / HK-15A / HK-16A",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-12A / HK-13A / HK-15A / HK-16A",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-12A / HK-13A / HK-15A / HK-16A",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-12A / HK-13A / HK-15A / HK-16A",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-12A / HK-13A / HK-15A / HK-16A",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "HK-14A / HK-19A / HK-20A / HK-21A / HK-23A /  HK-24A / HK-26A / HK-28A",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "HK-14A / HK-19A / HK-20A / HK-21A / HK-23A /  HK-24A / HK-26A / HK-28A",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "HK-14A / HK-19A / HK-20A / HK-21A / HK-23A /  HK-24A / HK-26A / HK-28A",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "HK-14A / HK-19A / HK-20A / HK-21A / HK-23A /  HK-24A / HK-26A / HK-28A",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "HK-14A / HK-19A / HK-20A / HK-21A / HK-23A /  HK-24A / HK-26A / HK-28A",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "GE-2A / GE-3A / GE-6A / GE-7A / GE-8A / GE-9A / GE-10A / GE-11A",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "GE-2A / GE-3A / GE-6A / GE-7A / GE-8A / GE-9A / GE-10A / GE-11A",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "GE-2A / GE-3A / GE-6A / GE-7A / GE-8A / GE-9A / GE-10A / GE-11A",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "GE-2A / GE-3A / GE-6A / GE-7A / GE-8A / GE-9A / GE-10A / GE-11A",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "GE-2A / GE-3A / GE-6A / GE-7A / GE-8A / GE-9A / GE-10A / GE-11A",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BM-401",
        "msrp": 260000,
        "distPrice": 104000,
        "dealerPrice": 156000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BM-401",
        "msrp": 260000,
        "distPrice": "-",
        "dealerPrice": 156000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BM-401",
        "msrp": 260000,
        "distPrice": 130000,
        "dealerPrice": 156000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BM-401",
        "msrp": 260000,
        "distPrice": 130000,
        "dealerPrice": 156000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BM-401",
        "msrp": 260000,
        "distPrice": "-",
        "dealerPrice": 156000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BM-402",
        "msrp": 260000,
        "distPrice": 104000,
        "dealerPrice": 156000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BM-402",
        "msrp": 260000,
        "distPrice": "-",
        "dealerPrice": 156000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BM-402",
        "msrp": 260000,
        "distPrice": 130000,
        "dealerPrice": 156000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BM-402",
        "msrp": 260000,
        "distPrice": 130000,
        "dealerPrice": 156000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BM-402",
        "msrp": 260000,
        "distPrice": "-",
        "dealerPrice": 156000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BM-403",
        "msrp": 350000,
        "distPrice": 140000,
        "dealerPrice": 210000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BM-403",
        "msrp": 350000,
        "distPrice": "-",
        "dealerPrice": 210000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BM-403",
        "msrp": 350000,
        "distPrice": 175000,
        "dealerPrice": 210000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BM-403",
        "msrp": 350000,
        "distPrice": 175000,
        "dealerPrice": 210000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BM-403",
        "msrp": 350000,
        "distPrice": "-",
        "dealerPrice": 210000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BM-1A",
        "msrp": 210000,
        "distPrice": 84000,
        "dealerPrice": 126000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BM-1A",
        "msrp": 210000,
        "distPrice": "-",
        "dealerPrice": 126000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BM-1A",
        "msrp": 210000,
        "distPrice": 105000,
        "dealerPrice": 126000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BM-1A",
        "msrp": 210000,
        "distPrice": 105000,
        "dealerPrice": 126000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BM-1A",
        "msrp": 210000,
        "distPrice": "-",
        "dealerPrice": 126000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BM-2A",
        "msrp": 300000,
        "distPrice": 120000,
        "dealerPrice": 180000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BM-2A",
        "msrp": 300000,
        "distPrice": "-",
        "dealerPrice": 180000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BM-2A",
        "msrp": 300000,
        "distPrice": 150000,
        "dealerPrice": 180000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BM-2A",
        "msrp": 300000,
        "distPrice": 150000,
        "dealerPrice": 180000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BM-2A",
        "msrp": 300000,
        "distPrice": "-",
        "dealerPrice": 180000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BZ-501",
        "msrp": 390000,
        "distPrice": 156000,
        "dealerPrice": 234000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BZ-501",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BZ-501",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BZ-501",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BZ-501",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BZ-502",
        "msrp": 450000,
        "distPrice": 180000,
        "dealerPrice": 270000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BZ-502",
        "msrp": 450000,
        "distPrice": "-",
        "dealerPrice": 270000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BZ-502",
        "msrp": 450000,
        "distPrice": 225000,
        "dealerPrice": 270000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BZ-502",
        "msrp": 450000,
        "distPrice": 225000,
        "dealerPrice": 270000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BZ-502",
        "msrp": 450000,
        "distPrice": "-",
        "dealerPrice": 270000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BZ-503",
        "msrp": 350000,
        "distPrice": 140000,
        "dealerPrice": 210000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BZ-503",
        "msrp": 350000,
        "distPrice": "-",
        "dealerPrice": 210000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BZ-503",
        "msrp": 350000,
        "distPrice": 175000,
        "dealerPrice": 210000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BZ-503",
        "msrp": 350000,
        "distPrice": 175000,
        "dealerPrice": 210000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BZ-503",
        "msrp": 350000,
        "distPrice": "-",
        "dealerPrice": 210000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BZ-1A",
        "msrp": 340000,
        "distPrice": 136000,
        "dealerPrice": 204000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BZ-1A",
        "msrp": 340000,
        "distPrice": "-",
        "dealerPrice": 204000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BZ-1A",
        "msrp": 340000,
        "distPrice": 170000,
        "dealerPrice": 204000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BZ-1A",
        "msrp": 340000,
        "distPrice": 170000,
        "dealerPrice": 204000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BZ-1A",
        "msrp": 340000,
        "distPrice": "-",
        "dealerPrice": 204000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BZ-2A",
        "msrp": 540000,
        "distPrice": 216000,
        "dealerPrice": 324000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BZ-2A",
        "msrp": 540000,
        "distPrice": "-",
        "dealerPrice": 324000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BZ-2A",
        "msrp": 540000,
        "distPrice": 270000,
        "dealerPrice": 324000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BZ-2A",
        "msrp": 540000,
        "distPrice": 270000,
        "dealerPrice": 324000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BZ-2A",
        "msrp": 540000,
        "distPrice": "-",
        "dealerPrice": 324000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BZ-3A",
        "msrp": 400000,
        "distPrice": 160000,
        "dealerPrice": 240000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BZ-3A",
        "msrp": 400000,
        "distPrice": "-",
        "dealerPrice": 240000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BZ-3A",
        "msrp": 400000,
        "distPrice": 200000,
        "dealerPrice": 240000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BZ-3A",
        "msrp": 400000,
        "distPrice": 200000,
        "dealerPrice": 240000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BZ-3A",
        "msrp": 400000,
        "distPrice": "-",
        "dealerPrice": 240000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BY-101",
        "msrp": 200000,
        "distPrice": 80000,
        "dealerPrice": 120000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BY-101",
        "msrp": 200000,
        "distPrice": "-",
        "dealerPrice": 120000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BY-101",
        "msrp": 200000,
        "distPrice": 100000,
        "dealerPrice": 120000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BY-101",
        "msrp": 200000,
        "distPrice": 100000,
        "dealerPrice": 120000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BY-101",
        "msrp": 200000,
        "distPrice": "-",
        "dealerPrice": 120000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "BY-2A",
        "msrp": 300000,
        "distPrice": 120000,
        "dealerPrice": 180000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "BY-2A",
        "msrp": 300000,
        "distPrice": "-",
        "dealerPrice": 180000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "BY-2A",
        "msrp": 300000,
        "distPrice": 150000,
        "dealerPrice": 180000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "BY-2A",
        "msrp": 300000,
        "distPrice": 150000,
        "dealerPrice": 180000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "BY-2A",
        "msrp": 300000,
        "distPrice": "-",
        "dealerPrice": 180000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "RR-1A",
        "msrp": 400000,
        "distPrice": 160000,
        "dealerPrice": 240000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "RR-1A",
        "msrp": 400000,
        "distPrice": "-",
        "dealerPrice": 240000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "RR-1A",
        "msrp": 400000,
        "distPrice": 200000,
        "dealerPrice": 240000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "RR-1A",
        "msrp": 400000,
        "distPrice": 200000,
        "dealerPrice": 240000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "RR-1A",
        "msrp": 400000,
        "distPrice": "-",
        "dealerPrice": 240000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "RR-2A",
        "msrp": 370000,
        "distPrice": 148000,
        "dealerPrice": 222000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "RR-2A",
        "msrp": 370000,
        "distPrice": "-",
        "dealerPrice": 222000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "RR-2A",
        "msrp": 370000,
        "distPrice": 185000,
        "dealerPrice": 222000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "RR-2A",
        "msrp": 370000,
        "distPrice": 185000,
        "dealerPrice": 222000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "RR-2A",
        "msrp": 370000,
        "distPrice": "-",
        "dealerPrice": 222000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "AU-1A",
        "msrp": 260000,
        "distPrice": 104000,
        "dealerPrice": 156000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "AU-1A",
        "msrp": 260000,
        "distPrice": "-",
        "dealerPrice": 156000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "AU-1A",
        "msrp": 260000,
        "distPrice": 130000,
        "dealerPrice": 156000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "AU-1A",
        "msrp": 260000,
        "distPrice": 130000,
        "dealerPrice": 156000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "AU-1A",
        "msrp": 260000,
        "distPrice": "-",
        "dealerPrice": 156000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "TS-301",
        "msrp": 390000,
        "distPrice": 156000,
        "dealerPrice": 234000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "TS-301",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "TS-301",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "TS-301",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "TS-301",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "TS-302",
        "msrp": 390000,
        "distPrice": 156000,
        "dealerPrice": 234000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "TS-302",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "TS-302",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "TS-302",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "TS-302",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "TS-303",
        "msrp": 390000,
        "distPrice": 156000,
        "dealerPrice": 234000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "TS-303",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "TS-303",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "TS-303",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "TS-303",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "TS-304",
        "msrp": 390000,
        "distPrice": 156000,
        "dealerPrice": 234000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "TS-304",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "TS-304",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "TS-304",
        "msrp": 390000,
        "distPrice": 195000,
        "dealerPrice": 234000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "TS-304",
        "msrp": 390000,
        "distPrice": "-",
        "dealerPrice": 234000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "VW-1A",
        "msrp": 230000,
        "distPrice": 92000,
        "dealerPrice": 138000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "VW-1A",
        "msrp": 230000,
        "distPrice": "-",
        "dealerPrice": 138000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "VW-1A",
        "msrp": 230000,
        "distPrice": 115000,
        "dealerPrice": 138000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "VW-1A",
        "msrp": 230000,
        "distPrice": 115000,
        "dealerPrice": 138000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "VW-1A",
        "msrp": 230000,
        "distPrice": "-",
        "dealerPrice": 138000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "CH-1A",
        "msrp": 230000,
        "distPrice": 92000,
        "dealerPrice": 138000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "CH-1A",
        "msrp": 230000,
        "distPrice": "-",
        "dealerPrice": 138000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "CH-1A",
        "msrp": 230000,
        "distPrice": 115000,
        "dealerPrice": 138000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "CH-1A",
        "msrp": 230000,
        "distPrice": 115000,
        "dealerPrice": 138000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "CH-1A",
        "msrp": 230000,
        "distPrice": "-",
        "dealerPrice": 138000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-4B",
        "msrp": 95000,
        "distPrice": 38000,
        "dealerPrice": 57000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-4B",
        "msrp": 95000,
        "distPrice": "-",
        "dealerPrice": 57000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-4B",
        "msrp": 95000,
        "distPrice": 47500,
        "dealerPrice": 57000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-4B",
        "msrp": 95000,
        "distPrice": 47500,
        "dealerPrice": 57000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-4B",
        "msrp": 95000,
        "distPrice": "-",
        "dealerPrice": 57000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-4B(S)",
        "msrp": 95000,
        "distPrice": 38000,
        "dealerPrice": 57000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-4B(S)",
        "msrp": 95000,
        "distPrice": "-",
        "dealerPrice": 57000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-4B(S)",
        "msrp": 95000,
        "distPrice": 47500,
        "dealerPrice": 57000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-4B(S)",
        "msrp": 95000,
        "distPrice": 47500,
        "dealerPrice": 57000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-4B(S)",
        "msrp": 95000,
        "distPrice": "-",
        "dealerPrice": 57000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-8B",
        "msrp": 130000,
        "distPrice": 52000,
        "dealerPrice": 78000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-8B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-8B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-8B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-8B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-8B(S)",
        "msrp": 130000,
        "distPrice": 52000,
        "dealerPrice": 78000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-8B(S)",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-8B(S)",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-8B(S)",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-8B(S)",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-81B",
        "msrp": 130000,
        "distPrice": 52000,
        "dealerPrice": 78000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-81B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-81B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-81B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-81B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-81B(S)",
        "msrp": 130000,
        "distPrice": 52000,
        "dealerPrice": 78000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-81B(S)",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-81B(S)",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-81B(S)",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-81B(S)",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-82B",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-82B",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-82B",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-82B",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-82B",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-10B",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-10B",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-10B",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-10B",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-10B",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-10B(S)",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-10B(S)",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-10B(S)",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-10B(S)",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-10B(S)",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-12B",
        "msrp": 130000,
        "distPrice": 52000,
        "dealerPrice": 78000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-12B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-12B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-12B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-12B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-12B(S)",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-12B(S)",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-12B(S)",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-12B(S)",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-12B(S)",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-14B",
        "msrp": 130000,
        "distPrice": 52000,
        "dealerPrice": 78000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-14B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-14B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-14B",
        "msrp": 130000,
        "distPrice": 65000,
        "dealerPrice": 78000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-14B",
        "msrp": 130000,
        "distPrice": "-",
        "dealerPrice": 78000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "DS-14B(S)",
        "msrp": 180000,
        "distPrice": 72000,
        "dealerPrice": 108000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "DS-14B(S)",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "DS-14B(S)",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "DS-14B(S)",
        "msrp": 180000,
        "distPrice": 90000,
        "dealerPrice": 108000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "DS-14B(S)",
        "msrp": 180000,
        "distPrice": "-",
        "dealerPrice": 108000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "M60 3M 연장케이블",
        "msrp": 90000,
        "distPrice": 36000,
        "dealerPrice": 54000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "M60 3M 연장케이블",
        "msrp": 90000,
        "distPrice": "-",
        "dealerPrice": 54000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "M60 3M 연장케이블",
        "msrp": 90000,
        "distPrice": 45000,
        "dealerPrice": 54000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "M60 3M 연장케이블",
        "msrp": 90000,
        "distPrice": 45000,
        "dealerPrice": 54000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "M60 3M 연장케이블",
        "msrp": 90000,
        "distPrice": "-",
        "dealerPrice": 54000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "M60 유니버셜 젠더 (20P)",
        "msrp": 25000,
        "distPrice": 10000,
        "dealerPrice": 15000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "M60 유니버셜 젠더 (20P)",
        "msrp": 25000,
        "distPrice": "-",
        "dealerPrice": 15000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "M60 유니버셜 젠더 (20P)",
        "msrp": 25000,
        "distPrice": 12500,
        "dealerPrice": 15000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "M60 유니버셜 젠더 (20P)",
        "msrp": 25000,
        "distPrice": 12500,
        "dealerPrice": 15000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "M60 유니버셜 젠더 (20P)",
        "msrp": 25000,
        "distPrice": "-",
        "dealerPrice": 15000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "3.5M 연장 케이블",
        "msrp": 50000,
        "distPrice": 20000,
        "dealerPrice": 30000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "3.5M 연장 케이블",
        "msrp": 50000,
        "distPrice": "-",
        "dealerPrice": 30000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "3.5M 연장 케이블",
        "msrp": 50000,
        "distPrice": 25000,
        "dealerPrice": 30000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "3.5M 연장 케이블",
        "msrp": 50000,
        "distPrice": 25000,
        "dealerPrice": 30000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "3.5M 연장 케이블",
        "msrp": 50000,
        "distPrice": "-",
        "dealerPrice": 30000
    },
    {
        "category": "master",
        "productCategory": "PnP Cable",
        "product": "PXE-M770 External Cable(8M)",
        "msrp": 60000,
        "distPrice": 24000,
        "dealerPrice": 36000
    },
    {
        "category": "team",
        "productCategory": "PnP Cable",
        "product": "PXE-M770 External Cable(8M)",
        "msrp": 60000,
        "distPrice": "-",
        "dealerPrice": 36000
    },
    {
        "category": "style",
        "productCategory": "PnP Cable",
        "product": "PXE-M770 External Cable(8M)",
        "msrp": 60000,
        "distPrice": 30000,
        "dealerPrice": 36000
    },
    {
        "category": "region",
        "productCategory": "PnP Cable",
        "product": "PXE-M770 External Cable(8M)",
        "msrp": 60000,
        "distPrice": 30000,
        "dealerPrice": 36000
    },
    {
        "category": "dealer",
        "productCategory": "PnP Cable",
        "product": "PXE-M770 External Cable(8M)",
        "msrp": 60000,
        "distPrice": "-",
        "dealerPrice": 36000
    },
    {
        "category": "team",
        "productCategory": "F#1 Status",
        "product": "F#1 12V Full Package",
        "msrp": 29000000,
        "dealerPrice": 17400000,
        "distPrice": "-"
    },
    {
        "category": "dealer",
        "productCategory": "F#1 Status",
        "product": "F#1 12V Full Package",
        "msrp": 29000000,
        "dealerPrice": 17400000,
        "distPrice": "-"
    },
    {
        "category": "style",
        "productCategory": "F#1 Status",
        "product": "F#1 12V Full Package",
        "msrp": 29000000,
        "dealerPrice": 17400000,
        "distPrice": "-"
    },
    {
        "category": "region",
        "productCategory": "F#1 Status",
        "product": "F#1 12V Full Package",
        "msrp": 29000000,
        "dealerPrice": 17400000,
        "distPrice": "-"
    },
    {
        "category": "team",
        "productCategory": "F#1 Status",
        "product": "F#1 3Way Speaker Package",
        "msrp": 16000000,
        "dealerPrice": 9600000,
        "distPrice": "-"
    },
    {
        "category": "dealer",
        "productCategory": "F#1 Status",
        "product": "F#1 3Way Speaker Package",
        "msrp": 16000000,
        "dealerPrice": 9600000,
        "distPrice": "-"
    },
    {
        "category": "style",
        "productCategory": "F#1 Status",
        "product": "F#1 3Way Speaker Package",
        "msrp": 16000000,
        "dealerPrice": 9600000,
        "distPrice": "-"
    },
    {
        "category": "region",
        "productCategory": "F#1 Status",
        "product": "F#1 3Way Speaker Package",
        "msrp": 16000000,
        "dealerPrice": 9600000,
        "distPrice": "-"
    },
    {
        "category": "team",
        "productCategory": "F#1 Status",
        "product": "F#1 Subwoofer",
        "msrp": 5000000,
        "dealerPrice": 3000000,
        "distPrice": "-"
    },
    {
        "category": "dealer",
        "productCategory": "F#1 Status",
        "product": "F#1 Subwoofer",
        "msrp": 5000000,
        "dealerPrice": 3000000,
        "distPrice": "-"
    },
    {
        "category": "style",
        "productCategory": "F#1 Status",
        "product": "F#1 Subwoofer",
        "msrp": 5000000,
        "dealerPrice": 3000000,
        "distPrice": "-"
    },
    {
        "category": "region",
        "productCategory": "F#1 Status",
        "product": "F#1 Subwoofer",
        "msrp": 5000000,
        "dealerPrice": 3000000,
        "distPrice": "-"
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-TWEETER(Custom fit)",
        "msrp": 700000,
        "dealerPrice": 420000,
        "distPrice": "-"
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-TWEETER(Custom fit)",
        "msrp": 700000,
        "dealerPrice": 420000,
        "distPrice": "-"
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-TWEETER(Custom fit)",
        "msrp": 700000,
        "dealerPrice": 420000,
        "distPrice": "-"
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-TWEETER(Custom fit)",
        "msrp": 700000,
        "dealerPrice": 420000,
        "distPrice": "-"
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-Midrange",
        "msrp": 850000,
        "dealerPrice": 510000,
        "distPrice": "-"
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-Midrange",
        "msrp": 850000,
        "dealerPrice": 510000,
        "distPrice": "-"
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-Midrange",
        "msrp": 850000,
        "dealerPrice": 510000,
        "distPrice": "-"
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-Midrange",
        "msrp": 850000,
        "dealerPrice": 510000,
        "distPrice": "-"
    },
    {
        "category": "team",
        "productCategory": "Alpine Status",
        "product": "HDZ-MidWoofer",
        "msrp": 1200000,
        "dealerPrice": 720000,
        "distPrice": "-"
    },
    {
        "category": "dealer",
        "productCategory": "Alpine Status",
        "product": "HDZ-MidWoofer",
        "msrp": 1200000,
        "dealerPrice": 720000,
        "distPrice": "-"
    },
    {
        "category": "style",
        "productCategory": "Alpine Status",
        "product": "HDZ-MidWoofer",
        "msrp": 1200000,
        "dealerPrice": 720000,
        "distPrice": "-"
    },
    {
        "category": "region",
        "productCategory": "Alpine Status",
        "product": "HDZ-MidWoofer",
        "msrp": 1200000,
        "dealerPrice": 720000,
        "distPrice": "-"
    }
];\nconst DATA_VERSION = 1770964035167;\n\n// Function to get text label for category\nfunction getCategoryLabel(cat) {\n    const labels = {\n        'master': '알파인사운드마스터',\n        'team': '팀알파인',\n        'style': '알파인스타일총판',\n        'region': '알파인 지역총판',\n        'dealer': '알파인 대리점'\n    };\n    return labels[cat] || cat;\n}\n\nlet priceData = [];\nconst FORCE_RESTORE_KEY = 'priceDataRestored_v2_calculated';\nconst VERSION_KEY = 'priceDataVersion';\n\ntry {\n    // Check LocalStorage Version\n    const storedVersion = localStorage.getItem(VERSION_KEY);\n    const storedData = localStorage.getItem('priceData');\n    const hasRestored = localStorage.getItem(FORCE_RESTORE_KEY);\n\n    // If Server Version is newer than Stored Version, use Server Data\n    if (typeof DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < DATA_VERSION)) {\n        console.log('Newer data version found on server. Updating local storage...');\n        priceData = JSON.parse(JSON.stringify(initialPriceData));\n        localStorage.setItem('priceData', JSON.stringify(priceData));\n        localStorage.setItem(VERSION_KEY, DATA_VERSION.toString());\n        localStorage.setItem(FORCE_RESTORE_KEY, new Date().toISOString());\n    } else if (storedData && hasRestored) {\n        // Load from storage if it exists and version is up to date\n        console.log('Loading price data from local storage...');\n        priceData = JSON.parse(storedData);\n    } else {\n        // First run or force restore needed\n        console.log('Initializing price data (First run)...');\n        priceData = JSON.parse(JSON.stringify(initialPriceData));\n        localStorage.setItem('priceData', JSON.stringify(priceData));\n        if (typeof DATA_VERSION !== 'undefined') localStorage.setItem(VERSION_KEY, DATA_VERSION.toString());\n        localStorage.setItem(FORCE_RESTORE_KEY, new Date().toISOString());\n    }\n\n} catch (e) {\n    console.error('Local Storage Error:', e);\n    priceData = initialPriceData;\n}\n\n// Sync Logic maintained for dynamic checks\nlet isUpdated = false;\nfunction savePriceData() {\n    localStorage.setItem('priceData', JSON.stringify(priceData));\n}\n