const express = require('express');
const router = express.Router();
const queries  = require('../queries/queries');
const helpers = require('../helpers/helpers');

router.post('/authenticate', function (req, res) {
    if (!req.body.login && !req.body.password) {
        return res.status(401).send({
            success: false,
            message: 'Please provide login and password'
        });
    }

    const login = req.body.login;
    const hashedPassword = helpers.hashString(req.body.password);

    queries.findUser(login, hashedPassword, (result) => {
        if (result.success === false) {
            return res.status(401).send(result);
        } else {
            res.send(result);
        }
    });
});

/**
 * services
 */

router.get('/api/getMonths', function (req, res) {
    queries.getMonths((result) => {
        res.send(result);
    })
});

router.get('/api/getDays', function (req, res) {
    const year = req.query.year;
    const month = req.query.month;

    queries.getDays(year, month, (result) => {
        res.send(result);
    });
});

router.get('/api/getServicesByDate', function (req, res) {
    const year = req.query.year;
    const month = req.query.month;
    const day = req.query.day;

    queries.getServicesByDate(year, month, day, (result) => {
        res.send(result);
    });
});

router.get('/api/findServicesByDescription', function (req, res) {
    const year = req.query.year;
    const month = req.query.month;
    const searchString = req.query.searchString;

    queries.findServicesByDescription(year, month, searchString, (result) => {
        res.send(result);
    });
});

router.post('/api/addService', function (req, res) {
    const
        date = req.body.date,
        serviceType = req.body.serviceType,
        material = req.body.material,
        description = req.body.description ? req.body.description : '',
        paymentType = req.body.paymentType,
        amount = req.body.amount,
        clientId = req.body.clientId;

    queries.addService(date, serviceType, material, description, paymentType, amount, clientId, (result) => {
        res.send(result);
    });
});

router.post('/api/addMultipleServices', function (req, res) {
    const services = req.body;

    if (!services.length) {
        return res.send({
            success: false,
            message: 'Please provide a correct array of the services'
        });
    } else {
        queries.addMultipleServices(services, (result) => {
            res.send(result);
        });
    }
});

router.post('/api/editService', function (req, res) {
    const
        id = req.body.id,
        date = req.body.date,
        serviceType = req.body.serviceType,
        material = req.body.material,
        description = req.body.description,
        paymentType = req.body.paymentType,
        amount = req.body.amount,
        clientId = req.body.clientId;

    queries.editService(id, date, serviceType, material, description, paymentType, amount, clientId, (result) => {
        res.send(result);
    })
});

router.get('/api/deleteService', function (req, res) {
    const id = req.query.id;

    queries.deleteService(id, (result) => {
        res.send(result);
    })
});

/**
 * end services
 */

/**
 * fines
 */

router.get('/api/getFinesByDate', function (req, res) {
    const year = req.query.year;
    const month = req.query.month;
    const day = req.query.day;

    queries.getFinesByDate(year, month, day, (result) => {
        res.send(result);
    });
});

router.post('/api/addFine', function (req, res) {
    const
        date = req.body.date,
        description = req.body.description ? req.body.description : '',
        amount = req.body.amount;

    queries.addFine(date, description, amount, (result) => {
        res.send(result);
    });
});

router.post('/api/editFine', function (req, res) {
    const
        id = req.body.id,
        date = req.body.date,
        description = req.body.description,
        amount = req.body.amount;

    queries.editFine(id, date, description, amount, (result) => {
        res.send(result);
    })
});

router.get('/api/deleteFine', function (req, res) {
    const id = req.query.id;

    queries.deleteFine(id, (result) => {
        res.send(result);
    })
});

/**
 * end fines
 */

/**
 * calculations
 */
router.get('/api/getSalarySplitted', function (req, res) {
    const month = req.query.month;
    const year = req.query.year;

    if (!month || !year) {
        return res.send({
            success: false,
            message: 'Please provide a month and an year'
        });
    } else {
        queries.getSalarySplitted(year, month, (salary) => {
            res.send(salary);
        });
    }
});


router.get('/api/getSalary', function (req, res) {
    const year = req.query.year;
    const month = req.query.month;

    let fixedSalary;

    queries.getFixedSalaryByDate(month, year, (fixedSalaryByDate) => {
        if (fixedSalaryByDate) {
            fixedSalary = fixedSalaryByDate.amount;

            queries.getSalary(year, month, (salary) => {
                if (!salary.success) {
                    return res.send({
                        success: false,
                        message: 'There\'s no days',
                    });
                }

                res.send({
                    success: true,
                    message: 'OK',
                    salary : salary.servicesReceived + fixedSalary - salary.finesAmount,
                    fixedSalary: fixedSalary,
                    received: salary.servicesReceived,
                    payed: salary.servicesAmount,
                    fines: salary.finesAmount
                });
            });
        } else {
            queries.getLastFixedSalary((lastFixedSalary) => {
                fixedSalary = lastFixedSalary.amount;

                queries.getSalary(year, month, (salary) => {
                    if (!salary.success) {
                        return res.send({
                            success: false,
                            message: 'There\'s no days',
                        });
                    }

                    res.send({
                        success: true,
                        message: 'Cannot get amount of fixed salary of specified period of time and calculate salary in automatic mode. Specified fixed salary is for the last month. Specify the fixed salary for that period of time.',
                        salary: salary.servicesReceived + fixedSalary - salary.finesAmount,
                        fixedSalary: fixedSalary,
                        received: salary.servicesReceived,
                        payed: salary.servicesAmount,
                        fines: salary.finesAmount
                    });
                });
            });
        }
    });
});

router.get('/api/getEarnByDay', function (req, res) {
    const year = req.query.year;
    const month = req.query.month;
    const day = req.query.day;

    queries.getEarnByDay(year, month, day, (result) => {
        if (result instanceof  Error) {
            return res.send({
                success: false,
                message: 'Error',
                data: null
            });
        }

        res.send({
            success: true,
            data: result
        });
    });
});

router.get('/api/getSalariesAndEarnsForCharts', function (req, res) {
    const startYear = parseInt(req.query.startYear);
    const endYear = parseInt(req.query.endYear);

    queries.getSalariesAndEarnsForCharts(startYear, endYear, (result) => {
        if (result instanceof  Error) {
            return res.send({
                success: false,
                message: 'Error',
                data: null
            });
        }

        res.send({
            success: true,
            data: {
                salariesAndEarns: result.salariesAndEarns,
                fixedSalaries: result.fixedSalaries
            }
        });
    })
});

router.get('/api/getFixedSalary', function (req, res) {
    queries.getFixedSalary((fixedSalary) => {
        res.send(fixedSalary);
    });
});

router.post('/api/editFixedSalary', function (req, res) {
    if (!req.body.id || !req.body.amount) {
        return res.send({
            success: false,
            message: 'Please provide id and amount'
        });
    } else {
        const id = req.body.id;
        const amount = req.body.amount;
        const month = req.body.month;
        const year = req.body.year;

        queries.editFixedSalary(id, amount, year, month, (result) => {
            res.send(result);
        });
    }
});

router.get('/api/deleteFixedSalary', function (req, res) {
    const id = req.query.id;

    queries.deleteFixedSalary(id, (deletedFixedSalary) => {
        res.send(deletedFixedSalary);
    });
});

router.post('/api/addFixedSalaryByDate', function (req, res) {
    if (!req.body.year || !req.body.month || !req.body.amount) {
        return res.send({
            success: false,
            message: 'Please provide year, month and amount'
        });
    } else {
        const year = req.body.year;
        const amount = req.body.amount;
        const month = req.body.month;

        queries.addAutoFixedSalary(amount, month, year, (result) => {
            res.send(result);
        });
    }
});

router.get('/api/getLastFixedSalary', function (req, res) {
    queries.getLastFixedSalary((fixedSalary) => {
        res.send(fixedSalary);
    });
});

router.get('/api/getFixedSalaryByDate', function (req, res) {
    if (!req.query.month || !req.query.year) {
        return res.send({
            success: false,
            message: 'Please provide year and month'
        });
    } else {
        const month = req.query.month;
        const year = req.query.year;

        queries.getFixedSalaryByDate(month, year, (fixedSalary) => {
            res.send(fixedSalary);
        });
    }
});

router.get('/api/editLastFixedSalary', function (req, res) {
    if (!req.query.amount) {
        return res.send({
            success: false,
            message: 'Please provide an amount'
        });
    } else {
        const amount = req.query.amount;

        queries.editLastFixedSalary(amount, (newFixedSalary) => {
            res.send(newFixedSalary);
        });
    }
});

/**
 * end auto fixed salary
 */

/**
 * end calculations
 */

/**
 * select boxes
 */

// materials
router.get('/api/getMaterials', function (req, res) {
    queries.getMaterials((materials) => {
        res.send(materials);
    });
});

router.get('/api/addMaterial', function (req, res) {
    const name = req.query.name;
    const alias = req.query.alias;

    queries.addMaterial(name, alias, (material) => {
        res.send(material);
    });
});

router.get('/api/editMaterial', function (req, res) {
    const id = req.query.id;
    const name = req.query.name;
    const alias = req.query.alias;

    queries.editMaterial(id, name, alias, (material) => {
        res.send(material);
    });
});

router.get('/api/deleteMaterial', function (req, res) {
    const id = req.query.id;

    queries.deleteMaterial(id, (material) => {
        res.send(material);
    });
});

// payment types
router.get('/api/getPaymentTypes', function (req, res) {
    queries.getPaymentTypes((paymentTypes) => {
        res.send(paymentTypes);
    });
});

router.get('/api/addPaymentType', function (req, res) {
    const name = req.query.name;
    const alias = req.query.alias;

    queries.addPaymentType(name, alias, (paymentType) => {
        res.send(paymentType);
    });
});

router.get('/api/editPaymentType', function (req, res) {
    const id = req.query.id;
    const name = req.query.name;
    const alias = req.query.alias;

    queries.editPaymentType(id, name, alias, (paymentType) => {
        res.send(paymentType);
    });
});

router.get('/api/deletePaymentType', function (req, res) {
    const id = req.query.id;

    queries.deletePaymentType(id, (paymentType) => {
        res.send(paymentType);
    });
});

// service types
router.get('/api/getServiceTypes', function (req, res) {
    queries.getServiceTypes((serviceTypes) => {
        res.send(serviceTypes);
    });
});

router.get('/api/getServiceTypeById', function (req, res) {
    const id = req.query.id;

    if (!id) {
        return res.send({
            success: false,
            message: 'Please provide an id'
        });
    } else {
        queries.getServiceTypeById(id, (serviceType) => {
            res.send(serviceType);
        });
    }
});

router.get('/api/addServiceType', function (req, res) {
    const name = req.query.name;
    const alias = req.query.alias;
    const rate = req.query.rate;

    queries.addServiceType(name, alias, rate, (serviceType) => {
        res.send(serviceType);
    });
});

router.get('/api/editServiceType', function (req, res) {
    const id = req.query.id;
    const name = req.query.name;
    const alias = req.query.alias;
    const rate = req.query.rate;

    queries.editServiceType(id, name, alias, rate, (serviceType) => {
        res.send(serviceType);
    });
});

router.get('/api/deleteServiceType', function (req, res) {
    const id = req.query.id;

    queries.deleteServiceType(id, (serviceType) => {
        res.send(serviceType);
    });
});

router.get('/api/addClient', function (req, res) {
    const clientName = req.query.clientName;
    const companyName = req.query.companyName;
    const phone = req.query.phone;
    const email = req.query.email;

    queries.addClient(clientName, companyName, phone, email, (client) => {
        res.send(client);
    });
});

router.get('/api/editClient', function (req, res) {
    const id = req.query.id;
    const clientName = req.query.clientName;
    const companyName = req.query.companyName;
    const phone = req.query.phone;
    const email = req.query.email;

    queries.editClient(id, clientName, companyName, phone, email, (client) => {
        res.send(client);
    });
});

router.get('/api/deleteClient', function (req, res) {
    const id = req.query.id;

    queries.deleteClient(id, (client) => {
        res.send(client);
    });
});

router.get('/api/getClients', function (req, res) {
    const limit = parseInt(req.query.limit);

    queries.getClients(limit, (clients) => {
        res.send(clients);
    });
});

router.get('/api/findClientsByClientNameAndCompanyName', function (req, res) {
    const searchString = req.query.searchString;

    queries.findClientsByClientNameAndCompanyName(searchString, (result) => {
        res.send(result);
    });
});

/**
 * end select boxes
 */

module.exports = router;