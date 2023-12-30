const Service = require('../models/Service');
const Fine = require('../models/Fine');
const Material = require('../models/Material');
const PaymentType = require('../models/PaymentType');
const ServiceType = require('../models/ServiceType');
const User = require('../models/User');
const FixedSalary = require('../models/FixedSalary');
const Client = require('../models/Client');

const helpers = require('../helpers/helpers');

const jwt = require('jsonwebtoken');

const config = require('../config/config');

const queries = {
    /**
     * queries for JWT
     */

    /**
     *
     * @param login
     * @param hashedPassword
     * @param callback
     */
    findUser : function (login, hashedPassword, callback) {
        User.findOne({
            login: login
        }, function (err, user) {
            if (err) {
                return console.error('Some troubles with DB maybe. Please try again latter');
            }

            if (!user) {
                callback({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {
                if (user.password !== hashedPassword) {
                    callback({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    const payload = {
                        login: user.login
                    };

                    const token = jwt.sign(payload, config.jwtSecret, {
                        expiresIn: '3d'
                    });

                    callback({
                        success: true,
                        message: 'Success! Take and enjoy your token',
                        token: token
                    });
                }
            }
        });
    },
    /**
     *
     * @param token
     * @param next
     * @param callback
     */
    apiMiddleware : function (token, next, callback) {
        if (token) {
            jwt.verify(token, config.jwtSecret, function (err) {
                if (err) {
                    return callback({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    next();
                }
            });
        } else {
            return callback({
                success: false,
                message: 'No token provided.'
            });
        }
    },

    /**
     *
     * queries for services
     *
     */

    /**
     *
     * @param callback
     */
    getMonths : function (callback) {
        Service.aggregate([
            {
                $project: {
                    month: {$month: "$date"},
                    year: {$year: "$date"}
                }
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month'
                    },
                    // distinctDate: {
                    //     $addToSet: {
                    //         year: "$year",
                    //         month: "$month"
                    //     },
                    // },
                },
            },
            {
                $sort: {"_id.year" : -1, "_id.month": -1}
            }
        ], function (err, result) {
            if (err) {
                console.error(err);
            } else {
                // return helpers.groupBy(result, '_id', 'year', 'month');
                callback(helpers.groupBy(result, '_id', 'year', 'month'));
            }
        });
    },
    /**
     *
     * @param year
     * @param month
     * @param callback
     */
    getDays : function (year, month, callback) {
        Service.aggregate([
            {
                $project: {
                    year: {$year: "$date"},
                    month: {$month: "$date"},
                    days: { $dayOfMonth: "$date" },
                }
            },
            {
                $match: {
                    year: parseInt(year),
                    month: parseInt(month)
                }
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month',
                        day: '$days'
                    }
                },
            },
            {
                $sort: {_id: -1}
            }
        ], function (err, result) {
            if (err) {
                console.error(err);
            } else {
                // return helpers.groupBy(result, '_id', 'year', 'month');
                callback(result);
            }
        });
    },
    /**
     *
     * @param year
     * @param month
     * @param day
     * @param callback
     */
    getServicesByDate : function(year, month, day, callback) {
        Service.aggregate([
            {
                $project: {
                    year: {$year : "$date"},
                    month: {$month : "$date"},
                    day: {$dayOfMonth: "$date"},
                    date: "$date",
                    description: "$description",
                    serviceType: "$serviceType",
                    material: "$material",
                    paymentType: "$paymentType",
                    amount: "$amount",
                    rate: "$rate",
                    total: "$total",
                    client: "$client"
                }
            },
            day ?
                {
                    $match: {
                        year : parseInt(year),
                        month: parseInt(month),
                        day: parseInt(day)
                    }
                }
            :
                {
                    $match: {
                        year: parseInt(year),
                        month: parseInt(month)
                    }
                },
            {
              $sort: {date: -1}
            }
        ], function (err, result) {
            if (err) throw err;

            Client.populate(result, {path: "client"}, function (err, result) {
                console.log('CLIENTS', result);
                callback(result);
            });

            // callback(result);
        });
    },
    /**
     *
     * @param year
     * @param month
     * @param searchString
     * @param callback
     */
    findServicesByDescription : function (year, month, searchString, callback) {
        if (!searchString) {
            return callback([]);
        }

        const string = searchString.replace(new RegExp("\\\\", "g"), "\\\\");

        Service.aggregate([
            {
                $project: {
                    year: {$year : "$date"},
                    month: {$month : "$date"},
                    day: {$dayOfMonth: "$date"},
                    date: "$date",
                    description: "$description",
                    serviceType: "$serviceType",
                    material: "$material",
                    paymentType: "$paymentType",
                    amount: "$amount",
                    rate: "$rate",
                    total: "$total"
                }
            },
            {
                $match: {
                    year : parseInt(year),
                    month: parseInt(month),
                    description: {
                        $regex: string, $options: 'ig'
                    }
                }
            },
            {
                $sort: {date: -1}
            }
            ], function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(result);
                }
            });
    },
    /**
     *
     * @param date
     * @param serviceType
     * @param rate
     * @param total
     * @param material
     * @param description
     * @param paymentType
     * @param amount
     * @param clientId
     * @param callback
     */
    addService : function (date, serviceType, rate, total, material, description, paymentType, amount, clientId, callback) {
        let service = new Service();

        service.serviceType = serviceType;
        service.material = material;
        service.description = description;
        service.paymentType = paymentType;
        service.amount = amount;
        service.date = date ? new Date(date) : Date.now();
        service.rate = rate;
        service.total = total;
        service.client = clientId;

        service.save(function (err, service) {
            if (err) {
                callback(err);
            } else {
                callback(service);
            }
        });
    },
    /**
     *
     * @param services
     * @param callback
     */
    addMultipleServices : function (services, callback) {
        let savedServices = [];

        services.forEach(function (service, index) {
            const
                date = service.date,
                serviceType = service.serviceType.name,
                material = service.material,
                description = service.description ? service.description : '',
                paymentType = service.paymentType,
                amount = service.amount,
                rate = service.serviceType.rate,
                clientId = service.clientId,
                total = amount * rate;

            queries.addService(date, serviceType, rate, total, material, description, paymentType, amount, clientId, (result) => {
                if (index + 1 === services.length) {
                    savedServices.push(result);
                    return callback(savedServices);
                } else {
                    savedServices.push(result);
                }
            });
        });
    },
    /**
     *
     * @param id
     * @param date
     * @param serviceType
     * @param material
     * @param description
     * @param paymentType
     * @param amount
     * @param clientId
     * @param callback
     */
    editService : function (id, date, serviceType, material, description, paymentType, amount, clientId, callback) {
        Service.findByIdAndUpdate(id, {
            $set: {
                date : date,
                serviceType : serviceType.name,
                material : material,
                description : description,
                paymentType : paymentType,
                amount : amount,
                rate : serviceType.rate,
                client : clientId,
                total : amount * serviceType.rate
            }
        }, {new: true}, function (err, service) {
            if (err) {
                callback(err)
            } else {
                callback(service);
            }
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    deleteService : function (id, callback) {
        Service.findByIdAndRemove(id, function (err, service) {
            if (err) {
                callback(err);
            } else {
                callback(service);
            }
        })
    },
    /**
     *
     * end queries for services
     *
     */

    /**
     *
     * queries for fines
     *
     */

    /**
     *
     * @param year
     * @param month
     * @param day?
     * @param callback
     */
    getFinesByDate : function(year, month, day, callback) {
        if (day) {
            Fine.aggregate([
                {
                    $project: {
                        year: {$year : "$date"},
                        month: {$month : "$date"},
                        day: {$dayOfMonth : "$date"},
                        date: "$date",
                        description: "$description",
                        amount: "$amount"
                    }
                },
                {
                    $match: {
                        year : parseInt(year),
                        month: parseInt(month),
                        day: parseInt(day)
                    }
                },
                {
                    $sort: {date: -1}
                }
            ], function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(result);
                }
            });
        } else {
            Fine.aggregate([
                {
                    $project: {
                        year: {$year : "$date"},
                        month: {$month : "$date"},
                        day: {$dayOfMonth : "$date"},
                        date: "$date",
                        description: "$description",
                        amount: "$amount"
                    }
                },
                {
                    $match: {
                        year : parseInt(year),
                        month: parseInt(month),
                    }
                },
                {
                    $group: {
                        _id: "$day"
                    }
                },
                {
                    $sort: {date: -1}
                }
            ], function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(result);
                }
            });
        }
    },
    /**
     *
     * @param date
     * @param description
     * @param amount
     * @param callback
     */
    addFine : function (date, description, amount, callback) {
        let fine = new Fine();

        fine.description = description;
        fine.amount = amount;
        fine.date = date ? new Date(date) : Date.now();

        this.getServicesByDate(fine.date.getFullYear(), fine.date.getMonth() + 1, fine.date.getDate(), (services) => {
            if (services.length > 0) {
                fine.save(function (err, fine) {
                    if (err) {
                        callback({
                            success: false,
                            message: 'Error'
                        });
                    } else {
                        callback({
                            success: true,
                            data: fine
                        });
                    }
                });
            } else {
                const err = {
                    success: false,
                    message: 'There are no services at that day. Please specify another one which has one at least.'
                };

                callback(err);
            }
        });
    },
    /**
     *
     * @param id
     * @param date
     * @param description
     * @param amount
     * @param callback
     */
    editFine : function (id, date, description, amount, callback) {
        const dateObj = new Date(date);

        this.getServicesByDate(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate(), (services) => {
            if (services.length > 0) {
                Fine.findByIdAndUpdate(id, {
                    $set: {
                        date : date,
                        description : description,
                        amount : amount
                    }
                }, {new: true}, function (err, fine) {
                    if (err) {
                        const err = {
                            success: false,
                            message: 'There is an error.'
                        };

                        callback(err)
                    } else {
                        const data = {
                            success: true,
                            message: 'The fine saved.',
                            data: fine
                        };

                        callback(data);
                    }
                });
            } else {
                const err = {
                    success: false,
                    message: 'There are no services at that day. Please specify another one which has one at least.'
                };

                callback(err);
            }
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    deleteFine : function (id, callback) {
        Fine.findByIdAndRemove(id, function (err, fine) {
            if (err) {
                callback(err);
            } else {
                callback(fine);
            }
        })
    },
    /**
     *
     * end queries for fines
     *
     */

    /**
     *
     * calculations
     *
     */

    /**
     *
     * @param year
     * @param month
     * @param callback
     */
    getSalary : function (year, month, callback) {
        let servicesAmount = null,
            servicesReceived = null,
            finesAmount = null;

        Service.aggregate([
            {
                $project: {
                    year: {$year: "$date"},
                    month: {$month: "$date"},
                    amount: "$amount",
                    total: "$total"
                }
            },
            {
                $match: {
                    year: parseInt(year),
                    month: parseInt(month)
                }
            },
            {
                $group: {
                    _id: null,
                    totalServicesAmount: {$sum: "$amount"},
                    totalServicesReceived: {$sum: "$total"}
                }
            }
        ], function (err, services) {
            if (err) {
                callback(err);
            } else {
                if (services.length === 0) {
                    return callback({
                        success: false
                    });
                }

                servicesAmount = services[0].totalServicesAmount;
                servicesReceived = services[0].totalServicesReceived;

                Fine.aggregate([
                    {
                        $project: {
                            year: {$year: "$date"},
                            month: {$month: "$date"},
                            amount: "$amount"
                        }
                    },
                    {
                        $match: {
                            year: parseInt(year),
                            month: parseInt(month)
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalFinesAmount: {$sum: "$amount"}
                        }
                    }
                ], function (err, fines) {
                    if (err) {
                        callback(err);
                    } else {
                        finesAmount = fines.length > 0 ? fines[0].totalFinesAmount : 0;

                        callback({
                            servicesAmount: servicesAmount,
                            servicesReceived: servicesReceived,
                            finesAmount: finesAmount,
                            success: true
                        });
                    }
                });
            }
        });
    },
    /**
     *
     * @param year
     * @param month
     * @param callback
     */
    getSalarySplitted : function (year, month, callback) {
        Service.aggregate([
            {
                $project: {
                    year: {$year: "$date"},
                    month: {$month: "$date"},
                    serviceType: "$serviceType",
                    amount: "$amount",
                    total: "$total"
                }
            },
            {
                $match: {
                    year: parseInt(year),
                    month: parseInt(month)
                }
            },
            {
                $group: {
                    _id: "$serviceType",
                    totalAmount: {$sum: "$amount"},
                    totalReceived: {$sum: "$total"}
                }
            }
        ], function (err, salary) {
            if (err) {
                callback(err);
            } else {
                callback(salary);
            }
        });
    },
    /**
     *
     * @param startYear
     * @param endYear
     * @param callback
     */
    getSalariesAndEarnsForCharts : function (startYear, endYear, callback) {
        Service.aggregate([
            {
                $project: {
                    year: {$year: "$date"},
                    month: {$month: "$date"},
                    day: {$dayOfMonth: "$date"},
                    amount: "$amount",
                    total: "$total"
                }
            },
            {
                $match: {
                    year: {
                      $gte: parseInt(startYear),
                      $lte: parseInt(endYear)
                    }
                }
            },
            {
                $group : {
                    _id : {
                        month: "$month",
                        year: "$year",
                    },
                    amount: { $sum: "$amount" },
                    total: { $sum: "$total" }
                }
            },
            {
                $sort: {"_id.year": -1, "_id.month": -1}
            }
        ], function (err, salariesAndEarns) {
            if (err) {
                return callback(err);
            } else {
                Fine.aggregate([
                    {
                        $project: {
                            year: {$year: "$date"},
                            month: {$month: "$date"},
                            amount: "$amount",
                        }
                    },
                    {
                        $match: {
                            year: {
                                $gte: parseInt(startYear),
                                $lte: parseInt(endYear)
                            }
                        }
                    },
                    {
                        $group : {
                            _id : {
                                month: "$month",
                                year: "$year",
                            },
                            amount: { $sum: "$amount" }
                        }
                    },
                    {
                        $sort: {"_id.year": -1, "_id.month": -1}
                    }
                ], function (err, fines) {
                    if (err) {
                        return callback(err);
                    }

                    FixedSalary.aggregate([
                        {
                            $project: {
                                year: 1,
                                month: 1,
                                amount: "$amount"
                            }
                        },
                        {
                            $sort: {"year": -1, "month": -1}
                        }
                    ], function (err, fixedSalaries) {
                        if (err) {
                            return callback(err);
                        } else {
                            salariesAndEarns.forEach(function (salaryAndEarn) {
                                const fixedSalaryYearIndexInArray = fixedSalaries.findIndex(fixedSalary => {
                                    return salaryAndEarn._id.year === fixedSalary.year;
                                });

                                const fixedSalaryMonthIndexInArray = fixedSalaries.findIndex(fixedSalary => {
                                    if (salaryAndEarn._id.month === fixedSalary.month) {
                                        return salaryAndEarn._id.year === fixedSalary.year;
                                    }
                                });

                                const fineMonthIndexInArray = fines.findIndex(fine => {
                                    if (salaryAndEarn._id.month === fine._id.month) {
                                        return salaryAndEarn._id.year === fine._id.year;
                                    }
                                });

                                if (fixedSalaryYearIndexInArray === -1 || (fixedSalaryYearIndexInArray >= 0 && fixedSalaryMonthIndexInArray === -1)) {
                                    salaryAndEarn.fixedSalary = fixedSalaries[0].amount;
                                    salaryAndEarn.isLastFixedSalary = true;
                                } else {
                                    salaryAndEarn.fixedSalary = fixedSalaries[fixedSalaryMonthIndexInArray].amount;
                                    salaryAndEarn.isLastFixedSalary = false;
                                }

                                if (fineMonthIndexInArray > -1) {
                                    salaryAndEarn.total = salaryAndEarn.total - fines[fineMonthIndexInArray].amount;
                                }
                            });


                            callback({
                                salariesAndEarns: salariesAndEarns,
                                fixedSalaries: fixedSalaries
                            });
                        }
                    })
                });
            }
        });



        // let startIndex, endIndex;
        // let salariesAndEarns = [];
        //
        // this.getMonths(async (monthList) => {
        //     if (!monthList) {
        //         return callback({
        //             success: false,
        //             message: 'There\'s no months yet, try again after the services will be added.'
        //         });
        //     }
        //
        //     if (monthList.length === 1) {
        //         startYear = monthList.year;
        //         endYear = monthList.year;
        //     }
        //
        //     startIndex = monthList.findIndex(year => year.year === startYear);
        //     endIndex = monthList.findIndex(year => year.year === endYear);
        //
        //     for (let yearsIndex = startIndex; yearsIndex <= endIndex; yearsIndex++) {
        //
        //         for (let monthsIndex = 0; monthsIndex < monthList[yearsIndex].months.length; monthsIndex++) {
        //
        //             salariesAndEarns.push(
        //                 (function () {
        //                     return new Promise((resolve) => {
        //                         queries.getSalary(monthList[yearsIndex].year, monthList[yearsIndex].months[monthsIndex], salary => {
        //                             resolve({
        //                                 year: monthList[yearsIndex].year,
        //                                 month: monthList[yearsIndex].months[monthsIndex],
        //                                 salary: salary
        //                             });
        //                             console.log({
        //                                 year: monthList[yearsIndex].year,
        //                                 month: monthList[yearsIndex].months[monthsIndex],
        //                                 salary: salary
        //                             });
        //                         });
        //                     })
        //                 })()
        //             );
        //         }
        //
        //     }
        //
        //     Promise.all(salariesAndEarns).then(results => callback(results));
        // });
    },
    /**
     *
     * @param year
     * @param month
     * @param day
     * @param callback
     */
    getEarnByDay(year, month, day, callback) {
        let servicesAmount = null,
            servicesReceived = null,
            finesAmount = null;

        Service.aggregate([
            {
                $project: {
                    year: {$year: "$date"},
                    month: {$month: "$date"},
                    day: {$dayOfMonth: "$date"},
                    amount: "$amount",
                    total: "$total"
                }
            },
            {
                $match: {
                    year: parseInt(year),
                    month: parseInt(month),
                    day: parseInt(day)
                }
            },
            {
                $group: {
                    _id: null,
                    totalServicesAmount: {$sum: "$amount"},
                    totalServicesReceived: {$sum: "$total"}
                }
            }
        ], function (err, services) {
            if (err) {
                callback(err);
            } else {
                if (services.length === 0) {
                    return callback({
                        success: false
                    });
                }

                servicesAmount = services[0].totalServicesAmount;
                servicesReceived = services[0].totalServicesReceived;

                Fine.aggregate([
                    {
                        $project: {
                            year: {$year: "$date"},
                            month: {$month: "$date"},
                            day: {$dayOfMonth: "$date"},
                            amount: "$amount"
                        }
                    },
                    {
                        $match: {
                            year: parseInt(year),
                            month: parseInt(month),
                            day: parseInt(day)
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalFinesAmount: {$sum: "$amount"}
                        }
                    }
                ], function (err, fines) {
                    if (err) {
                        callback(err);
                    } else {
                        finesAmount = fines.length > 0 ? fines[0].totalFinesAmount : 0;

                        callback({
                            servicesAmount: servicesAmount,
                            servicesReceived: servicesReceived,
                            finesAmount: finesAmount,
                            success: true
                        });
                    }
                });
            }
        });
    },
    /**
     *
     * @param callback
     */
    getFixedSalary : function (callback) {
        FixedSalary.aggregate([
            {
                $project: {
                    year: 1,
                    month: 1,
                    amount: "$amount"
                }
            },
            {
                $sort: {"year": -1, "month": -1}
            }
        ], function (err, fixedSalaries) {
            if (err) {
                callback({
                    success: false,
                    message: 'Something wrong with database maybe, try latter'
                });
            } else {
                callback({
                    success: true,
                    fixedSalary: fixedSalaries
                });
            }
        });
    },
    /**
     *
     * @param id
     * @param amount
     * @param year
     * @param month
     * @param callback
     */
    editFixedSalary : function (id, amount, year, month, callback) {
        FixedSalary.findByIdAndUpdate(id,
            {
                $set: {
                    amount: amount,
                    year: year,
                    month: month,
                }
            }, {new: true},
            function (err, modifiedFixedSalary) {
            if (err) {
                callback({
                    success: false,
                    message: 'Can`t edit fixed salary, Try again latter'
                });
            } else {
                callback({
                    success: true,
                    modifiedSalary: modifiedFixedSalary
                });
            }
        });
    },
    /**
     *
     * @param month
     * @param year
     * @param callback
     */
    getFixedSalaryByDate : function (month, year, callback) {
        FixedSalary.findOne({month: month, year: year}, function (err, newFixedSalary) {
            if (err) {
                callback(err);
            } else {
                callback(newFixedSalary);
            }
        });
    },
    /**
     *
     * @param callback
     */
    getLastFixedSalary : function (callback) {
        FixedSalary.aggregate([
            {
                $project: {
                    year: 1,
                    month: 1,
                    amount: "$amount"
                }
            },
            {
                $sort: {"year": -1, "month": -1}
            }
        ], function (err, fixedSalaries) {
            if (err) {
                callback(err);
            } else {
                callback(fixedSalaries[0]);
            }
        });
    },
    /**
     *
     * @param newAmount
     * @param callback
     */
    editLastFixedSalary : function (newAmount, callback) {
        this.getLastFixedSalary((fixedSalary) => {
            fixedSalary.amount = parseInt(newAmount);

            FixedSalary.findByIdAndUpdate(fixedSalary._id, fixedSalary, {new: true},
                function (err, modifiedFixedSalary) {
                    if (err) {
                        callback({
                            success: false,
                            message: 'Can`t edit fixed salary, Try again later'
                        });
                    } else {
                        callback({
                            success: true,
                            modifiedSalary: modifiedFixedSalary
                        });
                    }
                });
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    deleteFixedSalary : function (id, callback) {
        this.getLastFixedSalary((lastFixedSalary) => {
            if (lastFixedSalary.id !== id) {
                FixedSalary.findByIdAndRemove(id, function (err, fine) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(fine);
                    }
                });
            } else {
                callback({
                    success: false,
                    message: 'You can\'t delete the last fixed salary.'
                });
            }
        });
    },
    /**
     *
     * @param amount
     * @param month
     * @param year
     * @param callback?
     */
    addAutoFixedSalary : function (amount, month, year, callback) {
        let fixedSalary = new FixedSalary();

        fixedSalary.amount = amount;
        fixedSalary.month = month;
        fixedSalary.year = year;

        fixedSalary.save(function (err, fixedSalary) {
            if (callback) {
                if (err) {
                    callback(err);
                } else {
                    callback(fixedSalary);
                }
            }
        });
    },
    /**
     *
     * end calculations
     *
     */

    /**
     *
     * select boxes
     *
     */

    /**
     *
     * @param callback
     */
    getMaterials : function (callback) {
        Material.find((err, materials) => {
            if (err) {
                callback(err);
            } else {
                callback(materials);
            }
        });
    },
    /**
     *
     * @param name
     * @param alias
     * @param callback
     */
    addMaterial : function (name, alias, callback) {
        let material = new Material();

        material.name = name;
        material.alias = alias;

        material.save((err, material) => {
            if (err) {
                callback(err);
            } else {
                callback(material);
            }
        });
    },
    /**
     *
     * @param id
     * @param name
     * @param alias
     * @param callback
     */
    editMaterial : function (id, name, alias, callback) {
        Material.findByIdAndUpdate(id, {
            $set: {
                name: name,
                alias: alias
            }
        }, {new: true}, function (err, material) {
            if (err) {
                callback(err)
            } else {
                callback(material);
            }
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    deleteMaterial : function (id, callback) {
        Material.findByIdAndRemove(id, (err, material) => {
            if (err) {
                callback(err);
            } else {
                callback(material);
            }
        })
    },
    /**
     *
     * @param callback
     */
    getPaymentTypes : function (callback) {
        PaymentType.find((err, paymentTypes) => {
            if (err) {
                callback(err);
            } else {
                callback(paymentTypes);
            }
        });
    },
    /**
     *
     * @param name
     * @param alias
     * @param callback
     */
    addPaymentType : function (name, alias, callback) {
        let paymentType = new PaymentType();

        paymentType.name = name;
        paymentType.alias = alias;

        paymentType.save((err, paymentType) => {
            if (err) {
                callback(err);
            } else {
                callback(paymentType);
            }
        });
    },
    editPaymentType : function (id, name, alias, callback) {
        PaymentType.findByIdAndUpdate(id, {
            $set: {
                name: name,
                alias: alias
            }
        }, {new: true}, function (err, paymentType) {
            if (err) {
                callback(err)
            } else {
                callback(paymentType);
            }
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    deletePaymentType : function (id, callback) {
        PaymentType.findByIdAndRemove(id, (err, paymentType) => {
            if (err) {
                callback(err);
            } else {
                callback(paymentType);
            }
        })
    },
    /**
     *
     * @param callback
     */
    getServiceTypes : function (callback) {
        ServiceType.find((err, serviceTypes) => {
            if (err) {
                callback(err);
            } else {
                callback(serviceTypes);
            }
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    getServiceTypeById : function (id, callback) {
        ServiceType.findOne({'_id' : id}, (err, serviceType) => {
            if (err) {
                callback(err);
            } else {
                callback(serviceType);
            }
        });
    },
    /**
     *
     * @param name
     * @param alias
     * @param rate
     * @param callback
     */
    addServiceType : function (name, alias, rate, callback) {
        let serviceType = new ServiceType();

        serviceType.name = name;
        serviceType.alias = alias;
        serviceType.rate = rate / 100;

        serviceType.save((err, serviceType) => {
            if (err) {
                callback(err);
            } else {
                callback(serviceType);
            }
        });
    },
    /**
     *
     * @param id
     * @param name
     * @param alias
     * @param rate
     * @param callback
     */
    editServiceType : function (id, name, alias, rate, callback) {
        ServiceType.findByIdAndUpdate(id, {
            $set: {
                name: name,
                alias: alias,
                rate: rate / 100
            }
        }, {new: true}, function (err, serviceType) {
            if (err) {
                callback(err)
            } else {
                callback(serviceType);
            }
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    deleteServiceType : function (id, callback) {
        ServiceType.findByIdAndRemove(id, (err, serviceType) => {
            if (err) {
                callback(err);
            } else {
                callback(serviceType);
            }
        })
    },
    /**
     *
     * @param clientName
     * @param companyName
     * @param phone
     * @param email
     * @param callback
     */
    addClient : function (clientName, companyName, phone, email, callback) {
        let client = new Client();

        client.clientName = clientName;
        client.companyName = companyName;
        client.phone = phone;
        client.email = email;

        client.save((err, client) => {
            if (err) {
                callback(err);
            } else {
                callback(client);
            }
        });
    },
    /**
     *
     * @param id
     * @param clientName
     * @param companyName
     * @param phone
     * @param email
     * @param callback
     */
    editClient : function (id, clientName, companyName, phone, email, callback) {
        Client.findByIdAndUpdate(id, {
            $set: {
                clientName: clientName,
                companyName: companyName,
                phone: phone,
                email: email
            }
        }, {new: true}, function (err, client) {
            if (err) {
                callback(err)
            } else {
                callback(client);
            }
        });
    },
    /**
     *
     * @param id
     * @param callback
     */
    deleteClient : function (id, callback) {
        Client.findByIdAndRemove(id, (err, client) => {
            if (err) {
                callback(err);
            } else {
                callback(client);
            }
        })
    },
    /**
     *
     * @param limit
     * @param callback
     */
    getClients : function (limit, callback) {
        let clientCount = null;

        Client.count(function (err, count) {
            clientCount = count;
        });

        Client
            .find((err, clients) => {
                if (err) {
                    callback(err);
                } else {
                    callback({remains: clientCount - limit, clients: clients});
                }
            })
            .sort({_id: -1})
            .skip(limit)
            .limit(20);
    },
    /**
     *
     * @param searchString
     * @param callback
     * @returns {*}
     */
    findClientsByClientNameAndCompanyName : function (searchString, callback) {
        if (!searchString) {
            return callback([]);
        }

        const string = searchString.replace(new RegExp("\\\\", "g"), "\\\\");

        Client.aggregate([
            {
                $project: {
                    clientName: "$clientName",
                    companyName: "$companyName",
                    phone: "$phone",
                    email: "$email"
                }
            },
            {
                $match: {
                    $or: [
                        {
                            companyName: {
                                $regex: string,
                                $options: 'ig'
                            }
                        },
                        {
                            clientName: {
                                $regex: string,
                                $options: 'ig'
                            }
                        }
                    ]
                }
            },
            {
                $sort: {date: -1}
            }
        ], function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(result);
            }
        });
    },
};

module.exports = queries;