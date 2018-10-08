const express = require('express');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg')
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgresql://admin_user:Motorola@2019@dss-subm-postgresql-uat2.ci9ygz3u43cw.us-east-1.rds.amazonaws.com:5432/contract_dash';
var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgresql://admin_user:Motorola@2019@dss-subm-postgresql-uat2.ci9ygz3u43cw.us-east-1.rds.amazonaws.com:5432/contract_dash');


/* GET home page. */
const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



// the "index" route, which serves the Angular app
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
});

// some data for the API
//var sampleData = [{"status":"ACTIVE","mediandays":"135","contractperstatus":"9","territory":"OTHER"},{"status":"ACTIVE","mediandays":"15","contractperstatus":"4","territory":"T1"},{"status":"ACTIVE","mediandays":"395","contractperstatus":"1","territory":"T7"},{"status":"ACTIVE","mediandays":"203","contractperstatus":"3","territory":"T8"},{"status":"DRAFT","mediandays":"05","contractperstatus":"14","territory":"OTHER"},{"status":"DRAFT","mediandays":"03","contractperstatus":"5","territory":"T1"},{"status":"DRAFT","mediandays":"105","contractperstatus":"1","territory":"T2"},{"status":"DRAFT","mediandays":"38","contractperstatus":"3","territory":"T3"},{"status":"DRAFT","mediandays":"111","contractperstatus":"3","territory":"T4E"},{"status":"DRAFT","mediandays":"39","contractperstatus":"6","territory":"T4W"},{"status":"DRAFT","mediandays":"27","contractperstatus":"2","territory":"T5S"},{"status":"DRAFT","mediandays":"26","contractperstatus":"2","territory":"T6"},{"status":"DRAFT","mediandays":"29","contractperstatus":"2","territory":"T7"},{"status":"DRAFT","mediandays":"34","contractperstatus":"4","territory":"T8"},{"status":"GENERATE_PO","mediandays":"00","contractperstatus":"1","territory":"OTHER"},{"status":"GENERATE_PO","mediandays":"00","contractperstatus":"1","territory":"T2"},{"status":"GENERATE_PO","mediandays":"00","contractperstatus":"2","territory":"T3"},{"status":"GENERATE_PO","mediandays":"00","contractperstatus":"1","territory":"T4E"},{"status":"GENERATE_PO","mediandays":"00","contractperstatus":"6","territory":"T4W"},{"status":"GENERATE_PO","mediandays":"00","contractperstatus":"1","territory":"T5S"},{"status":"GENERATE_PO","mediandays":"00","contractperstatus":"2","territory":"T7"},{"status":"GENERATE_PO","mediandays":"05","contractperstatus":"3","territory":"T8"},{"status":"HOLD","mediandays":"00","contractperstatus":"1","territory":"T8"},{"status":"IN_PROG_ACK","mediandays":"00","contractperstatus":"1","territory":"T7"},{"status":"IN_PROG_AWT_3PS","mediandays":"00","contractperstatus":"1","territory":"T7"},{"status":"IN_PROG_AWT_BUS_UNIT_","mediandays":"00","contractperstatus":"1","territory":"T7"},{"status":"IN_PROGRESS","mediandays":"00","contractperstatus":"1","territory":"T3"},{"status":"IN_PROGRESS","mediandays":"00","contractperstatus":"1","territory":"T7"},{"status":"INSUFFICIENT DATA","mediandays":"00","contractperstatus":"1","territory":"T3"},{"status":"INSUFFICIENT DATA","mediandays":"00","contractperstatus":"1","territory":"T7"},{"status":"MODIFY_PO","mediandays":"00","contractperstatus":"1","territory":"T8"},{"status":"PO_ISSUED","mediandays":"08","contractperstatus":"1","territory":"OTHER"},{"status":"PO_ISSUED","mediandays":"00","contractperstatus":"1","territory":"T4E"},{"status":"PO_ISSUED","mediandays":"00","contractperstatus":"1","territory":"T4W"},{"status":"PO_ISSUED","mediandays":"03","contractperstatus":"1","territory":"T5S"},{"status":"PO_ISSUED","mediandays":"10","contractperstatus":"2","territory":"T7"},{"status":"PO_ISSUED","mediandays":"06","contractperstatus":"2","territory":"T8"},{"status":"QA_HOLD","mediandays":"08","contractperstatus":"1","territory":"T1"},{"status":"QA_HOLD","mediandays":"387","contractperstatus":"1","territory":"T7"},{"status":"QA_HOLD","mediandays":"59","contractperstatus":"2","territory":"T8"},{"status":"SIGNED","mediandays":"175","contractperstatus":"3","territory":"OTHER"},{"status":"SIGNED","mediandays":"71","contractperstatus":"1","territory":"T2"},{"status":"SIGNED","mediandays":"76","contractperstatus":"2","territory":"T3"},{"status":"SIGNED","mediandays":"183","contractperstatus":"1","territory":"T4E"},{"status":"SIGNED","mediandays":"108","contractperstatus":"6","territory":"T4W"},{"status":"SIGNED","mediandays":"215","contractperstatus":"2","territory":"T5S"},{"status":"SIGNED","mediandays":"67","contractperstatus":"1","territory":"T6"},{"status":"SIGNED","mediandays":"121","contractperstatus":"2","territory":"T8"}]

// the GET "foods" API endpoint
app.get('/cm_dashboard_api/v1/contract_state', function (req, res) {

    const results = [];
    var territory = req.param('territory');

    console.log("territory" + territory);
    if (territory == "all") {
        //     console.log('true');
        var postgresquery = "select status , sum (mediandays::INTEGER) as mediandays, sum(contractperstatus) as contractscount from ( select to_status as Status, median(DaysInStatus) as MedianDays, count(contract_number) as contractPerStatus, TERRITORY from ( select contract_number, to_status, min(sts_changed_on), DateMoved, to_number(trim(to_char(DateMoved - min(sts_changed_on),'DD')),'99G999D9S') as DaysInStatus, TERRITORY from ( select A2.contract_number, A2.to_status, A2.sts_changed_on,TERRITORY, coalesce( ( select max(A1.sts_changed_on) from ebs_contracts_state_master A1 where A1.contract_number = A2.contract_number and A1.from_STATUS = A2.to_status), current_date ) as DateMoved from ebs_contracts_state_master A2 order by contract_number, sts_changed_on ) resultset group by contract_number, to_status, DateMoved, TERRITORY )R2 group by to_status, TERRITORY ORDER BY TO_STATUS) R3 WHERE STATUS In ('GENERATE_PO','PO_ISSUED', 'QA_HOLD','MODIFY_PO')  GROUP BY STATUS ;"
    } else {
        // Convert to array
        var arr = territory.split(',');

        // Remove first element of array
        arr = arr.filter(e => e !== 'all');

        // Convert back to string
        territory = arr.join(', ');

        var postgresquery = "select status , sum (mediandays::INTEGER) as mediandays, sum(contractperstatus) as contractscount from ( select to_status as Status, median(DaysInStatus) as MedianDays, count(contract_number) as contractPerStatus, TERRITORY from ( select contract_number, to_status, min(sts_changed_on), DateMoved, to_number(trim(to_char(DateMoved - min(sts_changed_on),'DD')),'99G999D9S') as DaysInStatus, TERRITORY from ( select A2.contract_number, A2.to_status, A2.sts_changed_on,TERRITORY, coalesce( ( select max(A1.sts_changed_on) from ebs_contracts_state_master A1 where A1.contract_number = A2.contract_number and A1.from_STATUS = A2.to_status), current_date ) as DateMoved from ebs_contracts_state_master A2 order by contract_number, sts_changed_on ) resultset group by contract_number, to_status, DateMoved, TERRITORY )R2 group by to_status, TERRITORY ORDER BY TO_STATUS) R3 WHERE STATUS In ('GENERATE_PO','PO_ISSUED', 'QA_HOLD','MODIFY_PO')  and TERRITORY IN (" + territory + ") GROUP BY STATUS"
    }
    //  console.log("query"+postgresquery);
    db.any(postgresquery)
        .then(function (data) {

            return res.send(data);
        })
        .catch(function (error) {
            console.log('ERROR:', error)

        })

});

// the GET "territories for contract_state" API endpoint
app.get('/cm_dashboard_api/v1/territories', function (req, res) {

    const results = [];

    db.any("select distinct(territory) from ebs_contracts_state_master order by territory  asc")
        .then(function (data) {
            //   console.log(data); 

            return res.send(data);
        })
        .catch(function (error) {
            console.log('ERROR:', error)

        })

});


// the GET "foods" API endpoint
app.get('/cm_dashboard_api/v1/case_status', function (req, res) {
    var territory = req.param('territory');

    console.log("territory" + territory);
    if (territory == "all") {
        //     console.log('true');
        var postgresql="select status ,CASE WHEN status = 'Open' THEN '0'            WHEN status = 'Insufficient Data' THEN '1'            WHEN status = 'InProg' THEN '2'            WHEN status = 'InProg Acknow' THEN '3'            when status='InProg Awt 3PS' Then '4'            WHEN status ='InProg Awt Credit' Then '5'            When status ='InProg Awt Resource' then '6'            ELSE 'OTHER' END AS status_order, sum (mediandays::INTEGER) as mediandays, sum(contractperstatus) as contractscount from ( select to_status as Status, median(DaysInStatus) as MedianDays, count(case_number) as contractPerStatus, TERRITORY from ( select case_number, to_status, min(sts_changed_on), DateMoved, to_number(trim(to_char(DateMoved - min(sts_changed_on),'DD')),'99G999D9S') as DaysInStatus, TERRITORY from ( select A2.case_number, A2.to_status, A2.sts_changed_on,TERRITORY, coalesce( ( select max(A1.sts_changed_on) from sc_case_state_master A1 where A1.case_number = A2.case_number and A1.from_STATUS = A2.to_status), current_date ) as DateMoved from sc_case_state_master A2 order by case_number, sts_changed_on ) resultset group by case_number, to_status, DateMoved, TERRITORY )R2 group by to_status, TERRITORY ORDER BY TO_STATUS) R3 Group by status ORDER BY status_order  ;";
    } else {
        // Convert to array
        var arr = territory.split(',');

        // Remove first element of array
        arr = arr.filter(e => e !== 'all');

        // Convert back to string
        territory = arr.join(', ');

        var postgresql="select status ,CASE WHEN status = 'Open' THEN '0'            WHEN status = 'Insufficient Data' THEN '1'            WHEN status = 'InProg' THEN '2'            WHEN status = 'InProg Acknow' THEN '3'            when status='InProg Awt 3PS' Then '4'            WHEN status ='InProg Awt Credit' Then '5'            When status ='InProg Awt Resource' then '6'            ELSE 'OTHER' END AS status_order, sum (mediandays::INTEGER) as mediandays, sum(contractperstatus) as contractscount from ( select to_status as Status, median(DaysInStatus) as MedianDays, count(case_number) as contractPerStatus, TERRITORY from ( select case_number, to_status, min(sts_changed_on), DateMoved, to_number(trim(to_char(DateMoved - min(sts_changed_on),'DD')),'99G999D9S') as DaysInStatus, TERRITORY from ( select A2.case_number, A2.to_status, A2.sts_changed_on,TERRITORY, coalesce( ( select max(A1.sts_changed_on) from sc_case_state_master A1 where A1.case_number = A2.case_number and A1.from_STATUS = A2.to_status), current_date ) as DateMoved from sc_case_state_master A2 order by case_number, sts_changed_on ) resultset group by case_number, to_status, DateMoved, TERRITORY )R2 group by to_status, TERRITORY ORDER BY TO_STATUS) R3   TERRITORY IN ("  + territory + ") Group by status ORDER BY status_order"
    }
    //  console.log("query"+postgresquery);
    const results = [];

    db.any(postgresql)
        .then(function (data) {
            //   console.log(data); 

            return res.send(data);
        })
        .catch(function (error) {
            console.log('ERROR:', error)

        })

});


// the GET "territories for contract_state" API endpoint
app.get('/cm_dashboard_api/v1/case_territories', function (req, res) {

    const results = [];

    db.any("Select distinct(TERRITORY) from sc_case_state_master  order by territory asc")
        .then(function (data) {
            //   console.log(data); 

            return res.send(data);
        })
        .catch(function (error) {
            console.log('ERROR:', error)

        })
});

//api to get the last update time

app.get('/cm_dashboard_api/v1/batchtime', function (req, res) {

    const results = [];

    db.any('select max(last_run_date) from audit_log')
        .then(function (data) {
             console.log(data); 

            return res.send(data);
        })
        .catch(function (error) {
            console.log('ERROR:', error)

        })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// HTTP listener
app.listen(3100, function () {
    console.log('Example listening on port 3100!');
});
module.exports = app;
