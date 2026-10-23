"""
Mero Miti (मेरो मिति) - Universal Bikram Sambat (B.S.) Calendar & Date Engine for Python.
"""

from .core import (
    BsDate,
    AdDate,
    ValidationResult,
    ad_to_bs,
    bs_to_ad,
    register_year,
    get_days_in_bs_month,
    validate_bs_date,
    format_bs_date,
    parse_bs_date,
    to_nepali_digits,
    to_english_digits,
    get_fiscal_year,
    get_fiscal_year_range,
    get_fiscal_year_quarters,
    sync_years,
    fetch_year_patch,
    DEFAULT_CALENDAR_ENDPOINT,
    NEPALI_MONTHS_NP,
    NEPALI_MONTHS_EN,
    NEPALI_DAYS_SHORT_NP,
    NEPALI_DAYS_SHORT_EN,
)

__version__ = "1.0.0"
__all__ = [
    "BsDate",
    "AdDate",
    "ValidationResult",
    "ad_to_bs",
    "bs_to_ad",
    "register_year",
    "get_days_in_bs_month",
    "validate_bs_date",
    "format_bs_date",
    "parse_bs_date",
    "to_nepali_digits",
    "to_english_digits",
    "get_fiscal_year",
    "get_fiscal_year_range",
    "get_fiscal_year_quarters",
    "sync_years",
    "fetch_year_patch",
    "DEFAULT_CALENDAR_ENDPOINT",
    "NEPALI_MONTHS_NP",
    "NEPALI_MONTHS_EN",
    "NEPALI_DAYS_SHORT_NP",
    "NEPALI_DAYS_SHORT_EN",
]
