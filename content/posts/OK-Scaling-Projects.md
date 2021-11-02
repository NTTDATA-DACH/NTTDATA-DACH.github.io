---
title: "10 Lessons learnt from large-scale data migration projects"
type: article
date: 2021-06-01
image: "/posts/img/data.jpg"
draft: false
tags: ["data", "best practice", "development"]
authors:
 - Oliver Koeth
summary: "Data migration is of course only one aspect of system conversion. Usually data migration is performed in conjunction with other conversions like technology or interfaces. Nevertheless, data migration is often the most expensive and confusing part of the conversion project. So let’s revisit the handful of fairly large data migrations I encountered in my professional career and see which lessons can be drawn out of this experience."
---

Data migration is of course only one aspect of system conversion. Usually data migration is performed in conjunction with other conversions like technology or interfaces. Nevertheless, data migration is often the most expensive and confusing part of the conversion project. So let’s revisit the handful of fairly large data migrations I encountered in my professional career and see which lessons can be drawn out of this experience.

## 1 Improve data quality in source

The foremost objective of the data migration is to move records from the legacy system to the new system. Unfortunately, the data in legacy systems was created over a long period of time by all kinds of releases of the legacy system. From a version 1.0 to its current state and maybe even by a previous data migration. As a consequence, the data will most likely not meet the constraints expressed in the current business logic of the legacy system or the design and development of the new system. While data could also be rectified in-flight during the migration, the best location for data cleansing is still the source system. In the source system, the data cleansing can start immediately and can be conducted by the users themselves, while cleansing during migration will require additional logic and slow down the development and execution times of the migration.

## 2 Find a lingua franca for data

Often the data model of the legacy system (e.g. a several decades old mainframe system) and the new system (e.g. a complex packaged application) are based on entirely different technology platforms and a team responsible for one system will most likely not be able to understand the data model of the other system. Hence it is important to find a lingua franca in form of a technology neutral intermediate data format. Good candidates for such data formats are staging areas of data warehouses, interfaces to or from the legacy system, or common domain models of an enterprise service bus.

## 3 Access the data

Don’t be shy. Gain access to the legacy data as soon as possible. Find a form of access that suits you (e.g. SQL command line). Then start to investigate the data. Do not forget to regularly refresh your data from production. Use this access to immediately validate you design hypothesises. Let me give you an example: If there is an “own retail” flag and an “independent retail” flag, it’s quite save to bet your money on some retail outlets having both flags set. But don’t limit yourself to SQL access. Consider other technologies like NoSQL databases or access on transaction log level provided by tools like Oracle’s Golden Gate.

## 4 Count, measure, weigh your data and create a map


With access to the data start to count, measure, and weigh your data. For each entity count the columns and rows and you will learn where the hot spots of the migration will be. For low data volumes consider alternative approaches for data priming. If your table has create and last modify timestamps try to understand the volumes and timings in the life-cycle of the data. Create a map of your data. Which areas are well understood (e.g. from data centric interfaces, reports, or a piece of well maintained documentation)? Create heat maps to show high volume data. Identify areas of concern and dedicated extra time for heuristic data analysis and migration workshops. Create a list of all tables and identify those which need to be migrated. Group the tables by functional topics and design you migration workshops around this grouping.

## 5 Establish a data dictionary

If you haven’t started a proper database-backed data dictionary for your project it’s about time to create one. This data dictionary is the “definitive version of the truth” for the data model and can be accessed by members of all teams (feature development, integration, migration, test, …) and is changed in a controlled way. The data dictionary also provides a great way to report progress on the migration mapping.

## 6 Talk to all stakeholders

Be a social butterfly and meet all stakeholders of the data migration. Do not only talk to the “usual suspects” in the business and IT departments. Also spend time with the not so popular kids from the data privacy, data security (and in Germany: works council) camps. If left out, these stakeholders have the super-powers to put the data migration project to a full halt—even hours before the cut-over is scheduled to start.

## 7 Test data qualities and quantities

The migration test has two important objectives: a) is the data migrated in the right way, and b) is all relevant data migrated. The former can be tested by record-based comparison reports which are executed for an (ideally stratified) sample of your data and checked manually. The latter can be tested by summary reports counting the records in the legacy and the new system. Don’t expect the numbers to exactly match up, but be prepared to explain the differences.

## 8 Reconsider data archiving to minimize data volumes

The most efficient approach to data migration is not to migrate the data. While this approach can of course not be applied to all legacy data this rule should be applied to as many tables and as many rows as feasible. Use the heat map, time-stamps and data volumes to build your case for not having to migrate the data. A data migration is also a great chance to reconsider your data archiving strategy. An archive with good data retrieval methods or even automated restore procedures is a very good argument for not migrating data which is not so frequently accessed.

## 9 Start your migration early and finish late

The data migration is probably taking most of the time in the downtime window during cut-over. Hence consider reducing the run-time of the data migration by starting the data migration well before cut-over. This can either be achieved by delta loads or by starting with immutable data. Note that delta loads may only have to be established for the entities with the highest volumes (and possibly their parent entities). Also the data migration may well run longer than the actual cut-over. For example, secondary information like a customer’s older contact history records may be migrated after the cut-over was completed and the new system is live.

## 10 Design your new system with migration in mind

Last but not least, you need to understand that migration can become quite hard if it is conducted as an aftermath of the new system’s design. This does by no means advocate that the new system shall be limited by the capabilities which lie in the legacy data, but in areas where the current data base is insufficient a co-existence in conjunction with an eventual business migration needs to be taken into consideration.
But also from a teaming perspective, your migration has to be in the hearts and minds of the design and development teams of the new system. When they understand that the migration team is their key into the wicked world of legacy data they will intensify collaboration and arrive at a design that is not only brilliant on paper but actually works with the data at hand.
