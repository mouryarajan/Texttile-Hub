const filterData = async (searchKey, sortingCrieteria = null) => {
    // eslint-disable-next-line no-async-promise-executor,no-unused-vars
    return new Promise(async (resolve, reject) => {
        let tempMemberArray = [];
        const dob = "";
        let memberMasterCondition = {
            MiddleName: { [Op.ne]: null },
            FirstName: { [Op.ne]: null },
            LastName: { [Op.ne]: null },
        };
        let addressMasterCondition = "";
        let nativePlaceCondition = "";
        const condArray = [];
        const tempSortingCrieteriaArray = [];
        const sortingCrieteriaArray = [];
        let tempValue = null;
        let tempSortingOrder = null;
        if (sortingCrieteria !== null) {
            if (isDefined(sortingCrieteria.FirstName)) {
                tempValue = sortingCrieteria.FirstName;
                tempSortingOrder =
                    tempValue.substring(tempValue.indexOf("#") + 1, tempValue.length) ===
                        "0"
                        ? "DESC"
                        : "ASC";
                tempSortingCrieteriaArray.push({
                    value: ["FirstName", tempSortingOrder],
                    sequenceNo: parseInt(tempValue.substring(0, tempValue.indexOf("#"))),
                });
            }
            if (isDefined(sortingCrieteria.MiddleName)) {
                tempValue = sortingCrieteria.MiddleName;
                tempSortingOrder =
                    tempValue.substring(tempValue.indexOf("#") + 1, tempValue.length) ===
                        "0"
                        ? "DESC"
                        : "ASC";
                tempSortingCrieteriaArray.push({
                    value: ["MiddleName", tempSortingOrder],
                    sequenceNo: parseInt(tempValue.substring(0, tempValue.indexOf("#"))),
                });
                // tempSortingCrieteriaArray.push(["MiddleName", sortingOrder]);
            }
            if (isDefined(sortingCrieteria.LastName)) {
                tempValue = sortingCrieteria.LastName;
                tempSortingOrder =
                    tempValue.substring(tempValue.indexOf("#") + 1, tempValue.length) ===
                        "0"
                        ? "DESC"
                        : "ASC";
                tempSortingCrieteriaArray.push({
                    value: ["LastName", tempSortingOrder],
                    sequenceNo: parseInt(tempValue.substring(0, tempValue.indexOf("#"))),
                });

                // tempSortingCrieteriaArray.push(["LastName", sortingOrder]);
            }
            if (isDefined(sortingCrieteria.MaritalStatus)) {
                tempValue = sortingCrieteria.MaritalStatus;
                tempSortingOrder =
                    tempValue.substring(tempValue.indexOf("#") + 1, tempValue.length) ===
                        "0"
                        ? "DESC"
                        : "ASC";
                tempSortingCrieteriaArray.push({
                    value: ["MaritalStatus", tempSortingOrder],
                    sequenceNo: parseInt(tempValue.substring(0, tempValue.indexOf("#"))),
                });
                // tempSortingCrieteriaArray.push(["MaritalStatus", sortingOrder]);
            }
            if (isDefined(sortingCrieteria.NativePlace)) {
                tempValue = sortingCrieteria.NativePlace;
                tempSortingOrder =
                    tempValue.substring(tempValue.indexOf("#") + 1, tempValue.length) ===
                        "0"
                        ? "DESC"
                        : "ASC";
                tempSortingCrieteriaArray.push({
                    value: [
                        sequelize.col("FamilyMaster->NativePlaceMaster.Name"),
                        tempSortingOrder,
                    ],
                    sequenceNo: parseInt(tempValue.substring(0, tempValue.indexOf("#"))),
                });
            }
            if (isDefined(sortingCrieteria.DOB)) {
                tempValue = sortingCrieteria.DOB;
                tempSortingOrder =
                    tempValue.substring(tempValue.indexOf("#") + 1, tempValue.length) ===
                        "0"
                        ? "DESC"
                        : "ASC";
                tempSortingCrieteriaArray.push({
                    value: ["DOB", tempSortingOrder],
                    sequenceNo: parseInt(tempValue.substring(0, tempValue.indexOf("#"))),
                });
            }
            if (tempSortingCrieteriaArray.length === 0) {
                return resolve(false);
            }
            tempSortingCrieteriaArray.sort(function (a, b) {
                const keyA = parseInt(a.sequenceNo);
                const keyB = parseInt(b.sequenceNo);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });

            await tempSortingCrieteriaArray.map((item, index) => {
                sortingCrieteriaArray.push(item.value);
            });
        }

        if (isDefined(searchKey.Name)) {
            if (searchKey.Name.search(/^[0-9a-zA-Z]+$/) === 0) {
                memberMasterCondition = {
                    ...memberMasterCondition,
                    FirstName: {
                        [Op.like]: `%${searchKey.Name.replace(/\s+/g, " ").trim()}%`,
                    },
                };
            } else {
                return resolve([]);
            }
        }
        if (isDefined(searchKey.MaritalStatus)) {
            memberMasterCondition = {
                ...memberMasterCondition,
                MaritalStatus: searchKey.MaritalStatus,
            };
        }
        if (isDefined(searchKey.Sirname)) {
            if (searchKey.Sirname.search(/^[0-9a-zA-Z]+$/) === 0) {
                memberMasterCondition = {
                    ...memberMasterCondition,
                    LastName: {
                        [Op.like]: `%${searchKey.Sirname.replace(/\s+/g, " ").trim()}%`,
                    },
                };
            } else {
                return resolve([]);
            }
        }
        if (isDefined(searchKey.Gender)) {
            memberMasterCondition = {
                ...memberMasterCondition,
                Gender: searchKey.Gender,
            };
        }

        if (isDefined(searchKey.IsDaughter)) {
            const tempArray = [];
            if (searchKey.IsDaughter.indexOf(daughterStatus[0]) > -1) {
                tempArray.push("0");
            }
            if (searchKey.IsDaughter.indexOf(daughterStatus[1]) > -1) {
                tempArray.push("1");
            }

            if (isDefined(searchKey.Gender)) {
                if (searchKey.Gender.indexOf(gender[0]) > -1) {
                    memberMasterCondition = {
                        ...memberMasterCondition,
                        Gender: {
                            [Op.eq]: "NOTMATCHED",
                        },
                        IsDaughterFamily: tempArray,
                    };
                }
                if (searchKey.Gender.indexOf(gender[1]) > -1) {
                    memberMasterCondition = {
                        ...memberMasterCondition,
                        Gender: {
                            [Op.eq]: "FEMALE",
                        },
                        IsDaughterFamily: tempArray,
                    };
                }
            } else {
                memberMasterCondition = {
                    ...memberMasterCondition,
                    Gender: {
                        [Op.eq]: "FEMALE",
                    },
                    IsDaughterFamily: tempArray,
                };
            }
        }
        if (isDefined(searchKey.DOB)) {
            condArray.push(
                sequelize.where(
                    sequelize.fn(
                        "datediff",
                        searchKey.DOB,
                        sequelize.col("MemberMaster.DOB")
                    ),
                    {
                        [Op.eq]: 0,
                    }
                )
            );
        }

        if (isDefined(searchKey.MinDate) || isDefined(searchKey.MaxDate)) {
            if (isDefined(searchKey.MinDate) && isDefined(searchKey.MaxDate)) {
                memberMasterCondition = {
                    ...memberMasterCondition,
                    DOB: {
                        [Op.between]: [searchKey.MinDate, searchKey.MaxDate],
                    },
                };
            } else if (isDefined(searchKey.MinDate)) {
                memberMasterCondition = {
                    ...memberMasterCondition,
                    DOB: {
                        [Op.gte]: searchKey.MinDate,
                    },
                };
            } else if (isDefined(searchKey.MaxDate)) {
                memberMasterCondition = {
                    ...memberMasterCondition,
                    DOB: {
                        [Op.lte]: searchKey.MaxDate,
                    },
                };
            }
        }

        if (isDefined(searchKey.MinAge) || isDefined(searchKey.MaxAge)) {
            let minAge = 365.25;
            let maxAge = 200 * 365.25;

            if (isDefined(searchKey.MinAge)) {
                minAge = parseInt(searchKey.MinAge) * 365.25;
            }
            if (isDefined(searchKey.MaxAge)) {
                maxAge = parseInt(searchKey.MaxAge) * 365.25;
            }
            condArray.push(
                sequelize.where(
                    sequelize.fn(
                        "datediff",
                        new Date(),
                        sequelize.col("MemberMaster.DOB")
                    ),
                    {
                        [Op.gte]: minAge,
                    }
                )
            );

            condArray.push(
                sequelize.where(
                    sequelize.fn(
                        "datediff",
                        new Date(),
                        sequelize.col("MemberMaster.DOB")
                    ),
                    {
                        [Op.lte]: maxAge,
                    }
                )
            );
        }

        condArray.push(memberMasterCondition);
        if (isDefined(searchKey.City)) {
            addressMasterCondition = {
                ...addressMasterCondition,
                CityName: searchKey.City,
            };
        }

        if (isDefined(searchKey.State)) {
            addressMasterCondition = {
                ...addressMasterCondition,
                StateName: searchKey.State,
            };
        }
        if (isDefined(searchKey.Country)) {
            addressMasterCondition = {
                ...addressMasterCondition,
                CountryName: searchKey.Country,
            };
        }
        if (isDefined(searchKey.NativePlace)) {
            nativePlaceCondition = {
                ...nativePlaceCondition,
                Name: searchKey.NativePlace,
            };
        }

        await memberMaster
            .findAll({
                attributes: [
                    "MemberId",
                    "FirstName",
                    "MiddleName",
                    "LastName",
                    "Email",
                    "Mobile",
                    "DOB",
                    "AadhaarNo",
                    "MaritalStatus",
                    "BloodGroup",
                    "Zodiac",
                    "Gender",
                    "Studies",
                    "MarriageDate",
                    "ProfileImage",
                    "IsDaughterFamily",
                    "SpouseId",
                ],
                where: { [Op.and]: condArray },
                order:
                    sortingCrieteria !== null && sortingCrieteriaArray.length > 0
                        ? sortingCrieteriaArray
                        : [
                            [
                                sequelize.fn(
                                    "concat",
                                    sequelize.col("MemberMaster.FirstName"),
                                    sequelize.col("MemberMaster.MiddleName"),
                                    sequelize.col("MemberMaster.LastName")
                                ),
                                "ASC",
                            ],
                        ],

                include: [
                    {
                        attributes: ["MemberId", "FirstName", "MiddleName", "LastName"],
                        model: memberMaster,
                        as: "MotherEntry",
                    },
                    {
                        attributes: ["MemberId", "FirstName", "MiddleName", "LastName"],
                        model: memberMaster,
                        as: "FatherEntry",
                    },
                    {
                        attributes: ["MemberId", "FirstName", "MiddleName", "LastName"],
                        model: memberMaster,
                        as: "SpouseEntry",
                    },
                    {
                        attributes: ["MemberId", "FirstName", "MiddleName", "LastName"],
                        model: memberMaster,
                        as: "FatherInLawDetail",
                    },
                    {
                        attributes: ["MemberId", "FirstName", "MiddleName", "LastName"],
                        model: memberMaster,
                        as: "MotherInLawDetail",
                    },
                    {
                        attributes: ["Name"],
                        model: occupationMaster,
                        as: "OccupationDetail",
                    },
                    {
                        model: addressMaster,
                        as: "OfficeAddressDetail",
                    },
                    {
                        attributes: ["FamilyId", "HeadId"],
                        model: familyMaster,
                        include: [
                            {
                                model: addressMaster,
                                where: addressMasterCondition,
                                include: [{ model: region, attributes: ["countryCode"] }],
                            },
                            {
                                attributes: ["Name"],
                                model: nativeMaster,
                                where: nativePlaceCondition,
                            },
                        ],
                    },
                ],
            })
            .then(async (result) => {
                const tempResponsearray = [];
                if (result.length > 0) {
                    await result.map((item, index) => {
                        if (result[index].FamilyMaster !== null) {
                            if (result[index].dataValues.MiddleName === null) {
                                result[index].dataValues.MiddleName = "-";
                            }
                            if (result[index].dataValues.LastName === null) {
                                result[index].dataValues.LastName = "-";
                            }
                            if (result[index].dataValues.FirstName === null) {
                                result[index].dataValues.FirstName = "-";
                            }
                            if (isDefined(searchKey.FamilyHead)) {
                                if (
                                    searchKey.FamilyHead.indexOf(headStatus[0]) > -1 &&
                                    parseInt(result[index].dataValues.MemberId) ===
                                    parseInt(result[index].dataValues.FamilyMaster.HeadId)
                                ) {
                                    tempResponsearray.push(result[index]);
                                } else if (
                                    searchKey.FamilyHead.indexOf(headStatus[1]) > -1 &&
                                    parseInt(result[index].dataValues.MemberId) !==
                                    parseInt(result[index].dataValues.FamilyMaster.HeadId)
                                ) {
                                    tempResponsearray.push(result[index]);
                                }
                            } else {
                                tempResponsearray.push(result[index]);
                            }
                        }
                    });
                    tempMemberArray = tempResponsearray;
                }
                return resolve(tempMemberArray);
            });
    });
};