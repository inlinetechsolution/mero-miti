import unittest
import datetime
import os
import sys

# Ensure package is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from mero_miti import (
    ad_to_bs,
    bs_to_ad,
    BsDate,
    register_year,
    get_days_in_bs_month,
    validate_bs_date,
    format_bs_date,
    parse_bs_date,
    to_nepali_digits,
    to_english_digits,
    get_fiscal_year_range,
    get_fiscal_year_quarters,
)
from mero_miti.core import decode_month_days

class TestMeroMitiCore(unittest.TestCase):

    def test_24bit_decompression(self):
        # 2081 hex code is "bb9512"
        days_2081 = decode_month_days("bb9512")
        expected = [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]
        self.assertEqual(days_2081, expected)

    def test_ad_to_bs_anchor(self):
        # Anchor: 2023-04-14 AD -> 2080-01-01 BS
        ad = datetime.date(2023, 4, 14)
        bs = ad_to_bs(ad)
        self.assertEqual(bs, BsDate(2080, 1, 1))

    def test_ad_to_bs_known_date(self):
        # 2024-09-04 AD -> 2081-05-19 BS
        ad = datetime.date(2024, 9, 4)
        bs = ad_to_bs(ad)
        self.assertEqual(bs, BsDate(2081, 5, 19))

    def test_bs_to_ad_anchor(self):
        # 2080-01-01 BS -> 2023-04-14 AD
        bs = BsDate(2080, 1, 1)
        ad = bs_to_ad(bs)
        self.assertEqual(ad, datetime.date(2023, 4, 14))

    def test_bs_to_ad_known_date(self):
        # 2081-05-19 BS -> 2024-09-04 AD
        bs = BsDate(2081, 5, 19)
        ad = bs_to_ad(bs)
        self.assertEqual(ad, datetime.date(2024, 9, 4))

    def test_dynamic_year_extension(self):
        register_year(2095, "bba445")
        days = get_days_in_bs_month(2095, 1)
        self.assertEqual(days, 31)

    def test_validation(self):
        # Valid date
        res = validate_bs_date(BsDate(2081, 5, 19))
        self.assertTrue(res.is_valid)

        # Invalid month
        res_bad_month = validate_bs_date(BsDate(2081, 13, 1))
        self.assertFalse(res_bad_month.is_valid)

        # In 2081, Baishakh has 31 days. Day 32 must fail.
        res_bad_day = validate_bs_date(BsDate(2081, 1, 32))
        self.assertFalse(res_bad_day.is_valid)

    def test_parsing_and_numerals(self):
        res = parse_bs_date("१९/०५/२०८१", format="DD/MM/YYYY")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.parsed, BsDate(2081, 5, 19))

        formatted_ne = format_bs_date(res.parsed, format="DD/MM/YYYY", numeral="ne")
        self.assertEqual(formatted_ne, "१९/०५/२०८१")

    def test_fiscal_year(self):
        r = get_fiscal_year_range(2081)
        self.assertEqual(r.fiscal_year.code, "2081/82")
        self.assertEqual(r.start_bs, BsDate(2081, 4, 1))
        quarters = get_fiscal_year_quarters(2081)
        self.assertEqual(len(quarters), 4)

if __name__ == "__main__":
    unittest.main()
