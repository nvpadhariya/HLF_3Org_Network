sudo ./network.sh down

sudo ./network.sh createChannel -ca -s couchdb -i 2.0.0

sudo ./network.sh deployCC -c health-channel -ccn Hospital -ccp ../chaincode/hospital -ccl javascript -ccep "OR('PatientOrgMSP.peer','HospitalOrgMSP.peer','PharmacyOrgMSP.peer')" -cccg ../chaincode/hospital/collection_config.json