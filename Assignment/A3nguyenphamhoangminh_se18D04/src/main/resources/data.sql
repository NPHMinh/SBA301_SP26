-- ============================================================
-- TEST DATA for A3nguyenphamhoangminh_se180D04
-- Database: A3nguyenphamhoangminh_se180D04
--
-- HOW TO USE:
--   Run this script MANUALLY in SQL Server Management Studio (SSMS)
--   AFTER starting the Spring Boot application at least once
--   so that Hibernate has already created all the tables.
--
--   This script uses IF NOT EXISTS guards and can be run
--   multiple times without errors.
-- ============================================================

USE [A3nguyenphamhoangminh_se180D04];
GO

-- ============================================================
-- Clean up existing data (respecting FK order)
-- ============================================================
DELETE FROM [dbo].[booking_detail];
DELETE FROM [dbo].[booking_reservation];
DELETE FROM [dbo].[room_information];
DELETE FROM [dbo].[room_type];
DELETE FROM [dbo].[customer];
GO

-- ============================================================
-- 1. RoomType
-- ============================================================
SET IDENTITY_INSERT [dbo].[room_type] ON;

INSERT INTO [dbo].[room_type] (room_typeid, room_type_name, type_description, type_note)
VALUES
(1, N'Standard',  N'Standard room with basic amenities',      N'Suitable for solo travelers'),
(2, N'Deluxe',    N'Deluxe room with upgraded furnishings',   N'Suitable for couples'),
(3, N'Suite',     N'Luxury suite with separate living area',  N'Suitable for families or long stays'),
(4, N'Superior',  N'Superior room with garden or pool view',  N'Quiet and relaxing');

SET IDENTITY_INSERT [dbo].[room_type] OFF;
PRINT 'RoomType: inserted 4 rows.';
GO

-- ============================================================
-- 2. RoomInformation
--   roomStatus: 1 = Active, 0 = Inactive
-- ============================================================
SET IDENTITY_INSERT [dbo].[room_information] ON;

INSERT INTO [dbo].[room_information]
    (roomid, room_number, room_detail_description, room_max_capacity, room_status, room_price_per_day, room_typeid)
VALUES
(1,  '101', N'Standard single room, 1 queen bed, city view',     2, 1, 800000.00,  1),
(2,  '102', N'Standard single room, 1 queen bed, garden view',   2, 1, 800000.00,  1),
(3,  '103', N'Standard twin room, 2 single beds, city view',     2, 1, 850000.00,  1),
(4,  '201', N'Deluxe room, 1 king bed, pool view',               2, 1, 1200000.00, 2),
(5,  '202', N'Deluxe room, 1 king bed, sea view',                2, 1, 1300000.00, 2),
(6,  '203', N'Deluxe twin room, 2 double beds, city view',       3, 1, 1250000.00, 2),
(7,  '301', N'Junior Suite, living room + 1 king bed',           3, 1, 2000000.00, 3),
(8,  '302', N'Executive Suite, living room + 2 bedrooms',        5, 1, 3500000.00, 3),
(9,  '401', N'Superior room, balcony overlooking pool',          2, 1, 1100000.00, 4),
(10, '402', N'Superior double room, mountain view',              4, 0, 1150000.00, 4);

SET IDENTITY_INSERT [dbo].[room_information] OFF;
PRINT 'RoomInformation: inserted 10 rows.';
GO

-- ============================================================
-- 3. Customer
--   Passwords are BCrypt hashes of "password123"
--   customerStatus: 1 = Active, 0 = Inactive
-- ============================================================
SET IDENTITY_INSERT [dbo].[customer] ON;

INSERT INTO [dbo].[customer]
    (customerid, customer_full_name, telephone, email_address, customer_birthday, customer_status, password)
VALUES
(1, N'Nguyen Van An',     '0901234561', 'vanan@gmail.com',      '1990-05-15', 1, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO'),
(2, N'Tran Thi Bich',     '0912345672', 'thiibich@gmail.com',   '1995-08-22', 1, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO'),
(3, N'Le Minh Cuong',     '0923456783', 'minhcuong@gmail.com',  '1988-03-10', 1, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO'),
(4, N'Pham Thi Dao',      '0934567894', 'thidao@gmail.com',     '2000-11-30', 1, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO'),
(5, N'Hoang Van Em',      '0945678905', 'vanem@gmail.com',      '1993-07-04', 1, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO'),
(6, N'Nguyen Thi Phuong', '0956789016', 'thiphuong@gmail.com',  '1998-02-14', 1, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO'),
(7, N'Do Quoc Hung',      '0967890127', 'quochung@gmail.com',   '1985-09-08', 0, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO'),
(8, N'Bui Thi Lan',       '0978901238', 'thilan@gmail.com',     '1992-12-25', 1, '$2a$10$7EqJtq98hPqEX7fNZaFWoOe3sB0GqTf6FSp3kB5h/TgiJAf/5JKQO');

SET IDENTITY_INSERT [dbo].[customer] OFF;
PRINT 'Customer: inserted 8 rows.';
GO

-- ============================================================
-- 4. BookingReservation
--   bookingStatus: 1 = Active, 0 = Cancelled
-- ============================================================
SET IDENTITY_INSERT [dbo].[booking_reservation] ON;

INSERT INTO [dbo].[booking_reservation]
    (booking_reservationid, booking_date, total_price, booking_status, customerid)
VALUES
(1, '2026-01-10', 1600000.00, 1, 1),
(2, '2026-01-15', 3200000.00, 1, 2),
(3, '2026-01-20', 6000000.00, 1, 3),
(4, '2026-02-01', 2600000.00, 0, 4),
(5, '2026-02-10', 3750000.00, 1, 5),
(6, '2026-02-14', 3900000.00, 1, 6),
(7, '2026-02-18', 7000000.00, 1, 1),
(8, '2026-02-20', 1600000.00, 1, 8);

SET IDENTITY_INSERT [dbo].[booking_reservation] OFF;
PRINT 'BookingReservation: inserted 8 rows.';
GO

-- ============================================================
-- 5. BookingDetail (composite PK: bookingReservationID + roomID)
-- ============================================================
INSERT INTO [dbo].[booking_detail]
    (bookingReservationID, booking_reservationid, roomID, start_date, end_date, actual_price)
VALUES
-- Booking 1: Room 101, 2 nights (800000 x 2 = 1,600,000)
(1, 1, 1, '2026-01-12', '2026-01-14', 1600000.00),

-- Booking 2: Room 201 + Room 102, 2 nights (2,400,000 + 800,000 = 3,200,000)
(2, 2, 4, '2026-01-17', '2026-01-19', 2400000.00),
(2, 2, 2, '2026-01-17', '2026-01-19', 1600000.00),

-- Booking 3: Room 301, 3 nights (2,000,000 x 3 = 6,000,000)
(3, 3, 7, '2026-01-22', '2026-01-25', 6000000.00),

-- Booking 4 (Cancelled): Room 202, 2 nights (1,300,000 x 2 = 2,600,000)
(4, 4, 5, '2026-02-03', '2026-02-05', 2600000.00),

-- Booking 5: Room 203, 3 nights (1,250,000 x 3 = 3,750,000)
(5, 5, 6, '2026-02-12', '2026-02-15', 3750000.00),

-- Booking 6: Room 103 (2n) + Room 401 (2n) = 1,700,000 + 2,200,000 = 3,900,000
(6, 6, 3, '2026-02-15', '2026-02-17', 1700000.00),
(6, 6, 9, '2026-02-15', '2026-02-17', 2200000.00),

-- Booking 7: Room 302, 2 nights (3,500,000 x 2 = 7,000,000)
(7, 7, 8, '2026-02-20', '2026-02-22', 7000000.00),

-- Booking 8: Room 101, 2 nights (800,000 x 2 = 1,600,000)
(8, 8, 1, '2026-02-22', '2026-02-24', 1600000.00);

PRINT 'BookingDetail: inserted 9 rows.';
GO

-- ============================================================
-- Verify row counts
-- ============================================================
SELECT 'RoomType'          AS TableName, COUNT(*) AS RowCount FROM [dbo].[room_type]
UNION ALL
SELECT 'RoomInformation',               COUNT(*)              FROM [dbo].[room_information]
UNION ALL
SELECT 'Customer',                      COUNT(*)              FROM [dbo].[customer]
UNION ALL
SELECT 'BookingReservation',            COUNT(*)              FROM [dbo].[booking_reservation]
UNION ALL
SELECT 'BookingDetail',                 COUNT(*)              FROM [dbo].[booking_detail];
GO
