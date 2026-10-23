package com.meromiti.core

import org.junit.Assert.*
import org.junit.Test
import java.time.LocalDate

class MeroMitiCoreTest {

    @Test
    fun test24BitDecoding() {
        val days2081 = MeroMitiCore.decodeMonthDays("bb9512")
        val expected = intArrayOf(31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31)
        assertArrayEquals(expected, days2081)
    }

    @Test
    fun testAdToBsConversions() {
        // Anchor: 2023-04-14 AD -> 2080-01-01 BS
        val bs1 = MeroMitiCore.adToBs(LocalDate.of(2023, 4, 14))
        assertEquals(BsDate(2080, 1, 1), bs1)

        // Known Date: 2024-09-04 AD -> 2081-05-19 BS
        val bs2 = MeroMitiCore.adToBs(LocalDate.of(2024, 9, 4))
        assertEquals(BsDate(2081, 5, 19), bs2)
    }

    @Test
    fun testBsToAdConversions() {
        // 2080-01-01 BS -> 2023-04-14 AD
        val ad1 = MeroMitiCore.bsToAd(BsDate(2080, 1, 1))
        assertEquals(LocalDate.of(2023, 4, 14), ad1)

        // 2081-05-19 BS -> 2024-09-04 AD
        val ad2 = MeroMitiCore.bsToAd(BsDate(2081, 5, 19))
        assertEquals(LocalDate.of(2024, 9, 4), ad2)
    }

    @Test
    fun testDynamicYearExtension() {
        MeroMitiCore.registerYear(2095, "bba445")
        val days = MeroMitiCore.getDaysInBsMonth(2095, 1)
        assertEquals(31, days)
    }

    @Test
    fun testValidation() {
        val valid = MeroMitiCore.validateBsDate(BsDate(2081, 5, 19))
        assertTrue(valid.isValid)

        // Baishakh in 2081 has 31 days, so 32 should fail
        val invalidDay = MeroMitiCore.validateBsDate(BsDate(2081, 1, 32))
        assertFalse(invalidDay.isValid)
    }

    @Test
    fun testFiscalYearCalculations() {
        val fyRange = MeroMitiCore.getFiscalYearRange(2081)
        assertEquals("2081/82", fyRange.fiscalYear.code)
        assertEquals(2081, fyRange.startBs.year)
        assertEquals(4, fyRange.startBs.month)
        assertEquals(1, fyRange.startBs.day)
        assertEquals(2082, fyRange.endBs.year)
        assertEquals(3, fyRange.endBs.month)

        val quarters = MeroMitiCore.getFiscalYearQuarters(2081)
        assertEquals(4, quarters.size)
        assertEquals(1, quarters[0].quarter)
        assertEquals(4, quarters[3].quarter)
    }
}
