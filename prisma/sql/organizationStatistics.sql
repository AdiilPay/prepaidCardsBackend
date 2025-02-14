-- @param {String} $1:organizationId
-- @param {DateTime} $2:startDate
-- @param {DateTime} $3:endDate

SELECT
    DATE(date)                                AS date,
    SUM(IF(type = 'PAYMENT', ABS(amount), 0)) AS payments,
    SUM(IF(type = 'REFUND', amount, 0))  AS refunds,
    SUM(IF(type = 'DEPOSIT', amount, 0))           AS deposits,
    SUM(IF(type = 'WITHDRAWAL', amount, 0))        AS withdrawals,
    SUM(IF(type = 'SYSTEM', amount, 0))            AS other
FROM prisma.Transaction INNER JOIN prisma.Admin ON prisma.Transaction.adminId = prisma.Admin.id
WHERE prisma.Admin.organizationId = ? AND DATE(date) BETWEEN DATE(?) AND DATE(?)
GROUP BY DATE(date);