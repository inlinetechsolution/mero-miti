import XCTest
@testable import MeroMiti

final class MeroMitiTests: XCTestCase {

    func test24BitDecoding() {
        let days2080 = MeroMitiCore.decodeMonthDays(hex: "bb9512")
        let expected = [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]
        XCTAssertEqual(days2080, expected)
    }

    func testAdToBsConversions() {
        var comps = DateComponents()
        comps.year = 2023
        comps.month = 4
        comps.day = 14
        comps.timeZone = TimeZone(secondsFromGMT: 0)
        let anchor = Calendar(identifier: .gregorian).date(from: comps)!

        let bs1 = MeroMitiCore.adToBs(date: anchor)
        XCTAssertEqual(bs1, BsDate(year: 2080, month: 1, day: 1))

        comps.year = 2024
        comps.month = 9
        comps.day = 4
        let d2 = Calendar(identifier: .gregorian).date(from: comps)!
        let bs2 = MeroMitiCore.adToBs(date: d2)
        XCTAssertEqual(bs2, BsDate(year: 2081, month: 5, day: 19))

        // Boundary Start: 1916-04-13 -> 1973-01-01 BS
        comps.year = 1916
        comps.month = 4
        comps.day = 13
        let dStart = Calendar(identifier: .gregorian).date(from: comps)!
        let bsStart = MeroMitiCore.adToBs(date: dStart)
        XCTAssertEqual(bsStart, BsDate(year: 1973, month: 1, day: 1))

        // Boundary End: 2043-04-13 -> 2099-12-30 BS
        comps.year = 2043
        comps.month = 4
        comps.day = 13
        let dEnd = Calendar(identifier: .gregorian).date(from: comps)!
        let bsEnd = MeroMitiCore.adToBs(date: dEnd)
        XCTAssertEqual(bsEnd, BsDate(year: 2099, month: 12, day: 30))
    }

    func testBsToAdConversions() {
        let ad1 = MeroMitiCore.bsToAd(bs: BsDate(year: 2080, month: 1, day: 1))
        let comps1 = Calendar(identifier: .gregorian).dateComponents([.year, .month, .day], from: ad1)
        XCTAssertEqual(comps1.year, 2023)
        XCTAssertEqual(comps1.month, 4)
        XCTAssertEqual(comps1.day, 14)

        let ad2 = MeroMitiCore.bsToAd(bs: BsDate(year: 2081, month: 5, day: 19))
        let comps2 = Calendar(identifier: .gregorian).dateComponents([.year, .month, .day], from: ad2)
        XCTAssertEqual(comps2.year, 2024)
        XCTAssertEqual(comps2.month, 9)
        XCTAssertEqual(comps2.day, 4)

        // Boundary Start: 1973-01-01 BS -> 1916-04-13 AD
        let adStart = MeroMitiCore.bsToAd(bs: BsDate(year: 1973, month: 1, day: 1))
        let compsStart = Calendar(identifier: .gregorian).dateComponents([.year, .month, .day], from: adStart)
        XCTAssertEqual(compsStart.year, 1916)
        XCTAssertEqual(compsStart.month, 4)
        XCTAssertEqual(compsStart.day, 13)

        // Boundary End: 2099-12-30 BS -> 2043-04-13 AD
        let adEnd = MeroMitiCore.bsToAd(bs: BsDate(year: 2099, month: 12, day: 30))
        let compsEnd = Calendar(identifier: .gregorian).dateComponents([.year, .month, .day], from: adEnd)
        XCTAssertEqual(compsEnd.year, 2043)
        XCTAssertEqual(compsEnd.month, 4)
        XCTAssertEqual(compsEnd.day, 13)
    }

    func testDynamicYearExtension() {
        MeroMitiCore.registerYear(year: 2095, hexCode: "bba445")
        let days = MeroMitiCore.getDaysInBsMonth(year: 2095, month: 1)
        XCTAssertEqual(days, 31)
    }

    func testValidation() {
        let valid = MeroMitiCore.validateBsDate(bs: BsDate(year: 2081, month: 5, day: 19))
        XCTAssertTrue(valid.isValid)

        let invalid = MeroMitiCore.validateBsDate(bs: BsDate(year: 2081, month: 1, day: 32))
        XCTAssertFalse(invalid.isValid)
    }
}
