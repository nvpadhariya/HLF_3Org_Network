#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    # local NAME=$(one_line_pem $4)
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    # local PP=$(one_line_pem $4)
    # local CP=$(one_line_pem $5)
    # local NAME=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s/\${NAME}/$NAME/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    # local NAME=$(one_line_pem $4)
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    # local PP=$(one_line_pem $4)
    # local CP=$(one_line_pem $5)
    # local NAME=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s/\${NAME}/$NAME/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=7051
CAPORT=7054
NAME=patientorg
PEERPEM=organizations/peerOrganizations/patientorg/tlsca/tlsca.patientorg-cert.pem
CAPEM=organizations/peerOrganizations/patientorg/ca/ca.patientorg-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $NAME $PEERPEM $CAPEM)" > organizations/peerOrganizations/patientorg/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $NAME $PEERPEM $CAPEM)" > organizations/peerOrganizations/patientorg/connection-org1.yaml

ORG=2
P0PORT=9051
CAPORT=8054
NAME=hospitalorg
PEERPEM=organizations/peerOrganizations/hospitalorg/tlsca/tlsca.hospitalorg-cert.pem
CAPEM=organizations/peerOrganizations/hospitalorg/ca/ca.hospitalorg-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $NAME $PEERPEM $CAPEM)" > organizations/peerOrganizations/hospitalorg/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $NAME $PEERPEM $CAPEM)" > organizations/peerOrganizations/hospitalorg/connection-org2.yaml

ORG=3
P0PORT=8051
CAPORT=6054
NAME=pharmacyorg
PEERPEM=organizations/peerOrganizations/pharmacyorg/tlsca/tlsca.pharmacyorg-cert.pem
CAPEM=organizations/peerOrganizations/pharmacyorg/ca/ca.pharmacyorg-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $NAME $PEERPEM $CAPEM)" > organizations/peerOrganizations/pharmacyorg/connection-org3.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $NAME $PEERPEM $CAPEM)" > organizations/peerOrganizations/pharmacyorg/connection-org3.yaml
