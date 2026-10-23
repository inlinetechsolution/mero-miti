import datetime
from dataclasses import dataclass
from typing import List, Optional, Union, Dict

@dataclass
class BsDate:
    year: int
    month: int
    day: int

    def __str__(self) -> str:
        return f"{self.year:04d}-{self.month:02d}-{self.day:02d}"

@dataclass
class AdDate:
    year: int
    month: int
    day: int

    def __str__(self) -> str:
        return f"{self.year:04d}-{self.month:02d}-{self.day:02d}"

@dataclass
class ValidationResult:
    is_valid: bool
    error: Optional[str] = None
    parsed: Optional[BsDate] = None

@dataclass
class BsFiscalYear:
    start_bs_year: int
    end_bs_year: int
    code: str
    nepali_code: str

@dataclass
class FiscalYearRange:
    fiscal_year: BsFiscalYear
    start_bs: BsDate
    end_bs: BsDate
    start_ad: AdDate
    end_ad: AdDate
    start_date: datetime.date
    end_date: datetime.date

@dataclass
class FiscalQuarterRange:
    quarter: int
    name: str
    nepali_name: str
    start_bs: BsDate
    end_bs: BsDate
    start_ad: AdDate
    end_ad: AdDate
    start_date: datetime.date
    end_date: datetime.date

NEPALI_MONTHS_NP = [
    "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
    "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
]

NEPALI_MONTHS_EN = [
    "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
]

NEPALI_DAYS_SHORT_NP = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"]
NEPALI_DAYS_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

NEPALI_DIGITS_MAP = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
}
ENGLISH_DIGITS_MAP = {v: k for k, v in NEPALI_DIGITS_MAP.items()}

# Anchor: 2080-01-01 BS = 2023-04-14 AD
ANCHOR_BS_YEAR = 2080
ANCHOR_BS_MONTH = 1
ANCHOR_BS_DAY = 1
ANCHOR_AD_DATE = datetime.date(2023, 4, 14)

# 24-bit compressed calendar data (2 bits/month, 6 hex chars per year)
COMPRESSED_CALENDAR_DATA: Dict[int, str] = {
  1973: "7b9512", 1974: "ada445", 1975: "af6445", 1976: "bb9506", 1977: "bba112",
  1978: "aea445", 1979: "af9445", 1980: "bb9506", 1981: "aba145", 1982: "aea445",
  1983: "af9445", 1984: "bb9506", 1985: "aba145", 1986: "aea445", 1987: "bb9445",
  1988: "bb9506", 1989: "aba445", 1990: "aea445", 1991: "bb9445", 1992: "bb9512",
  1993: "aba445", 1994: "aea445", 1995: "bb9505", 1996: "bb9506", 1997: "aea445",
  1998: "aed445", 1999: "bb9506", 2000: "7b9512", 2001: "aea445", 2002: "af9445",
  2003: "bb9506", 2004: "7b9512", 2005: "aea445", 2006: "af9445", 2007: "bb9506",
  2008: "aba142", 2009: "aea445", 2010: "af9445", 2011: "bb9506", 2012: "aba145",
  2013: "aea445", 2014: "af9445", 2015: "bb9506", 2016: "aba145", 2017: "aea445",
  2018: "bb9445", 2019: "bb9512", 2020: "aba445", 2021: "aea445", 2022: "bb9505",
  2023: "bb9512", 2024: "aba445", 2025: "aea445", 2026: "bb9506", 2027: "7b9512",
  2028: "aea445", 2029: "aed445", 2030: "bb9506", 2031: "7b9512", 2032: "aea445",
  2033: "af9445", 2034: "bb9506", 2035: "7ba142", 2036: "aea445", 2037: "af9445",
  2038: "bb9506", 2039: "aba145", 2040: "aea445", 2041: "af9445", 2042: "bb9506",
  2043: "aba145", 2044: "aea445", 2045: "bb9445", 2046: "bb9506", 2047: "aba445",
  2048: "aea445", 2049: "bb9505", 2050: "bb9512", 2051: "aba445", 2052: "aea445",
  2053: "bb9505", 2054: "bb9512", 2055: "aea445", 2056: "aed445", 2057: "bb9506",
  2058: "7b9512", 2059: "aea445", 2060: "af9445", 2061: "bb9506", 2062: "7ba112",
  2063: "aea445", 2064: "af9445", 2065: "bb9506", 2066: "aba142", 2067: "aea445",
  2068: "af9445", 2069: "bb9506", 2070: "aba145", 2071: "aea445", 2072: "bb9445",
  2073: "bb9506", 2074: "aba445", 2075: "aea445", 2076: "bb9505", 2077: "bb9512",
  2078: "aba445", 2079: "aea445", 2080: "bb9505", 2081: "bb9512", 2082: "aea445",
  2083: "aea445", 2084: "bb9506", 2085: "7b9512", 2086: "aea445", 2087: "aea515",
  2088: "6f6515", 2089: "7b9515", 2090: "7b9515", 2091: "aea515", 2092: "6f9515",
  2093: "7b9515", 2094: "ae9515", 2095: "aea455", 2096: "6f9445", 2097: "bb9515",
  2098: "aea112", 2099: "aea415"
}

_decoded_cache: Dict[int, List[int]] = {}

def decode_month_days(hex_str: str) -> List[int]:
    num = int(hex_str, 16)
    days = [0] * 12
    for m in range(11, -1, -1):
        shift = (11 - m) * 2
        code = (num >> shift) & 0x3
        days[m] = 29 + code
    return days

def register_year(year: int, hex_or_days: Union[str, List[int]]) -> None:
    """Dynamically register a newly published calendar year at runtime."""
    if isinstance(hex_or_days, str):
        COMPRESSED_CALENDAR_DATA[year] = hex_or_days
        _decoded_cache.pop(year, None)
    elif isinstance(hex_or_days, list):
        if len(hex_or_days) != 12:
            raise ValueError("Days list must contain exactly 12 months")
        _decoded_cache[year] = hex_or_days

def get_days_in_bs_month(year: int, month: int) -> int:
    if not (1 <= month <= 12):
        raise ValueError(f"Month must be between 1 and 12, got {month}")
    if year not in _decoded_cache:
        hex_code = COMPRESSED_CALENDAR_DATA.get(year)
        if hex_code:
            _decoded_cache[year] = decode_month_days(hex_code)
        else:
            # Astronomical fallback projection
            _decoded_cache[year] = [31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30]
    return _decoded_cache[year][month - 1]

def to_nepali_digits(text: Union[str, int]) -> str:
    return "".join(NEPALI_DIGITS_MAP.get(ch, ch) for ch in str(text))

def to_english_digits(text: str) -> str:
    return "".join(ENGLISH_DIGITS_MAP.get(ch, ch) for ch in str(text))

def ad_to_bs(ad_date: datetime.date) -> BsDate:
    """Convert a Gregorian (A.D.) date to Bikram Sambat (B.S.)."""
    days_diff = (ad_date - ANCHOR_AD_DATE).days

    cur_year = ANCHOR_BS_YEAR
    cur_month = ANCHOR_BS_MONTH
    cur_day = ANCHOR_BS_DAY

    if days_diff >= 0:
        while days_diff > 0:
            days_in_month = get_days_in_bs_month(cur_year, cur_month)
            remaining_in_month = days_in_month - cur_day
            if days_diff <= remaining_in_month:
                cur_day += days_diff
                days_diff = 0
            else:
                days_diff -= (remaining_in_month + 1)
                cur_day = 1
                cur_month += 1
                if cur_month > 12:
                    cur_month = 1
                    cur_year += 1
    else:
        days_diff = -days_diff
        while days_diff > 0:
            if days_diff < cur_day:
                cur_day -= days_diff
                days_diff = 0
            else:
                days_diff -= cur_day
                cur_month -= 1
                if cur_month < 1:
                    cur_month = 12
                    cur_year -= 1
                cur_day = get_days_in_bs_month(cur_year, cur_month)

    return BsDate(cur_year, cur_month, cur_day)

def bs_to_ad(bs: BsDate) -> datetime.date:
    """Convert a Bikram Sambat (B.S.) date to Gregorian (A.D.)."""
    total_days = 0

    if bs.year >= ANCHOR_BS_YEAR:
        for y in range(ANCHOR_BS_YEAR, bs.year):
            for m in range(1, 13):
                total_days += get_days_in_bs_month(y, m)
        for m in range(1, bs.month):
            total_days += get_days_in_bs_month(bs.year, m)
        total_days += (bs.day - 1)
        return ANCHOR_AD_DATE + datetime.timedelta(days=total_days)
    else:
        for y in range(bs.year + 1, ANCHOR_BS_YEAR):
            for m in range(1, 13):
                total_days += get_days_in_bs_month(y, m)
        for m in range(bs.month, 13):
            total_days += get_days_in_bs_month(bs.year, m)
        total_days -= (bs.day - 1)
        return ANCHOR_AD_DATE - datetime.timedelta(days=total_days)

def bs_to_py_date(bs: BsDate) -> datetime.date:
    """Convert a Bikram Sambat date to a native Python datetime.date."""
    return bs_to_ad(bs)

def bs_to_ad_date(bs: BsDate) -> AdDate:
    """Convert a Bikram Sambat date to an AdDate representation."""
    d = bs_to_ad(bs)
    return AdDate(d.year, d.month, d.day)

DEFAULT_CALENDAR_ENDPOINT = "https://meromiti.com/api/calendar-years"

def sync_years(endpoint_url: str = DEFAULT_CALENDAR_ENDPOINT) -> Dict[int, str]:
    """Automatically synchronizes official calendar years from the Mero Miti cloud API.
    Registers newly published years dynamically into runtime memory."""
    import urllib.request
    import json
    try:
        req = urllib.request.Request(endpoint_url, headers={"User-Agent": "MeroMiti-Python/1.0.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                payload = json.loads(response.read().decode('utf-8'))
                years = payload.get("years", {})
                for yr_str, hex_code in years.items():
                    register_year(int(yr_str), hex_code)
                return years
    except Exception:
        pass
    return {}

def fetch_year_patch(year: int, endpoint_url: str = DEFAULT_CALENDAR_ENDPOINT) -> bool:
    """On-demand micro-fetch for a single specific future year."""
    import urllib.request
    import json
    try:
        url = f"{endpoint_url}{'&' if '?' in endpoint_url else '?'}year={year}"
        req = urllib.request.Request(url, headers={"User-Agent": "MeroMiti-Python/1.0.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                payload = json.loads(response.read().decode('utf-8'))
                hex_code = payload.get("hex")
                if hex_code:
                    register_year(year, hex_code)
                    return True
    except Exception:
        pass
    return False

def validate_bs_date(bs: BsDate, locale: str = 'ne') -> ValidationResult:
    """Strictly validates if a B.S. date actually exists in the Nepali calendar."""
    month_names = NEPALI_MONTHS_NP if locale == 'ne' else NEPALI_MONTHS_EN

    if not (1970 <= bs.year <= 2150):
        err = "साल १९७० देखि २१५० हुनुपर्छ" if locale == 'ne' else "Year must be 1970 - 2150"
        return ValidationResult(is_valid=False, error=err)

    if not (1 <= bs.month <= 12):
        err = "महिना १ देखि १२ हुनुपर्छ" if locale == 'ne' else "Month must be 1 - 12"
        return ValidationResult(is_valid=False, error=err)

    max_days = get_days_in_bs_month(bs.year, bs.month)
    if not (1 <= bs.day <= max_days):
        err = f"{bs.year} साल {month_names[bs.month - 1]}मा {max_days} दिन मात्र छन्" if locale == 'ne' \
              else f"{month_names[bs.month - 1]} {bs.year} has only {max_days} days"
        return ValidationResult(is_valid=False, error=err)

    return ValidationResult(is_valid=True, parsed=bs)

def format_bs_date(bs: BsDate, format: str = "DD/MM/YYYY", numeral: str = "en") -> str:
    pad_year = f"{bs.year:04d}"
    pad_month = f"{bs.month:02d}"
    pad_day = f"{bs.day:02d}"

    res = format.replace("YYYY", pad_year).replace("MM", pad_month).replace("DD", pad_day)
    if numeral == "ne":
        res = to_nepali_digits(res)
    return res

def parse_bs_date(date_str: str, format: str = "DD/MM/YYYY", locale: str = "ne") -> ValidationResult:
    """Parses and validates a string formatted date."""
    if not date_str:
        return ValidationResult(is_valid=False, error="Date string is empty")

    normalized = to_english_digits(date_str.strip())
    sep = '.' if '.' in format else ('-' if '-' in format else '/')
    parts = normalized.split(sep)
    fmt_parts = format.split(sep)

    if len(parts) != 3 or len(fmt_parts) != 3:
        return ValidationResult(is_valid=False, error=f"Format must match {format}")

    try:
        y, m, d = 0, 0, 0
        for p, f in zip(parts, fmt_parts):
            f_upper = f.upper()
            val = int(p)
            if f_upper.startswith('Y'):
                y = val
            elif f_upper.startswith('M'):
                m = val
            elif f_upper.startswith('D'):
                d = val
        bs = BsDate(y, m, d)
        return validate_bs_date(bs, locale=locale)
    except ValueError:
        return ValidationResult(is_valid=False, error="Date contains non-numeric values")

def get_fiscal_year(date: Optional[Union[datetime.date, BsDate, AdDate]] = None) -> BsFiscalYear:
    """Returns the Nepali Fiscal Year (आर्थिक वर्ष) for a given date."""
    if date is None:
        bs = ad_to_bs(datetime.date.today())
    elif isinstance(date, BsDate):
        bs = date
    elif isinstance(date, AdDate):
        bs = ad_to_bs(date)
    elif isinstance(date, datetime.date):
        bs = ad_to_bs(date)
    else:
        bs = ad_to_bs(datetime.date.today())

    start_year = bs.year if bs.month >= 4 else bs.year - 1
    end_year = start_year + 1
    code = f"{start_year}/{end_year % 100:02d}"
    return BsFiscalYear(
        start_bs_year=start_year,
        end_bs_year=end_year,
        code=code,
        nepali_code=to_nepali_digits(code)
    )

def get_fiscal_year_range(start_bs_year: Optional[int] = None) -> FiscalYearRange:
    """Returns exact Gregorian and BS date boundaries for a Nepali Fiscal Year."""
    if start_bs_year is None:
        start_bs_year = get_fiscal_year().start_bs_year
    end_year = start_bs_year + 1

    start_bs = BsDate(start_bs_year, 4, 1)
    last_day = get_days_in_bs_month(end_year, 3)
    end_bs = BsDate(end_year, 3, last_day)

    start_date = bs_to_ad(start_bs)
    end_date = bs_to_ad(end_bs)
    start_ad = AdDate(start_date.year, start_date.month, start_date.day)
    end_ad = AdDate(end_date.year, end_date.month, end_date.day)

    fy = get_fiscal_year(start_bs)

    return FiscalYearRange(
        fiscal_year=fy,
        start_bs=start_bs,
        end_bs=end_bs,
        start_ad=start_ad,
        end_ad=end_ad,
        start_date=start_date,
        end_date=end_date
    )

def get_fiscal_year_quarters(start_bs_year: Optional[int] = None) -> List[FiscalQuarterRange]:
    """Calculates all 4 financial quarters for a Nepali Fiscal Year."""
    r = get_fiscal_year_range(start_bs_year)
    y1 = r.fiscal_year.start_bs_year
    y2 = r.fiscal_year.end_bs_year

    q1_end = get_days_in_bs_month(y1, 6)
    q2_end = get_days_in_bs_month(y1, 9)
    q3_end = get_days_in_bs_month(y1, 12)
    q4_end = get_days_in_bs_month(y2, 3)

    q1_bs_s = BsDate(y1, 4, 1)
    q1_bs_e = BsDate(y1, 6, q1_end)
    q2_bs_s = BsDate(y1, 7, 1)
    q2_bs_e = BsDate(y1, 9, q2_end)
    q3_bs_s = BsDate(y1, 10, 1)
    q3_bs_e = BsDate(y1, 12, q3_end)
    q4_bs_s = BsDate(y2, 1, 1)
    q4_bs_e = BsDate(y2, 3, q4_end)

    return [
        FiscalQuarterRange(1, "Q1 (Shrawan - Ashwin)", "प्रथम त्रैमासिक (साउन - असोज)", q1_bs_s, q1_bs_e, bs_to_ad_date(q1_bs_s), bs_to_ad_date(q1_bs_e), bs_to_py_date(q1_bs_s), bs_to_py_date(q1_bs_e)),
        FiscalQuarterRange(2, "Q2 (Kartik - Poush)", "दोस्रो त्रैमासिक (कात्तिक - पुस)", q2_bs_s, q2_bs_e, bs_to_ad_date(q2_bs_s), bs_to_ad_date(q2_bs_e), bs_to_py_date(q2_bs_s), bs_to_py_date(q2_bs_e)),
        FiscalQuarterRange(3, "Q3 (Magh - Chaitra)", "तेस्रो त्रैमासिक (माघ - चैत)", q3_bs_s, q3_bs_e, bs_to_ad_date(q3_bs_s), bs_to_ad_date(q3_bs_e), bs_to_py_date(q3_bs_s), bs_to_py_date(q3_bs_e)),
        FiscalQuarterRange(4, "Q4 (Baisakh - Ashadh)", "चौथो त्रैमासिक (बैशाख - असार)", q4_bs_s, q4_bs_e, bs_to_ad_date(q4_bs_s), bs_to_ad_date(q4_bs_e), bs_to_py_date(q4_bs_s), bs_to_py_date(q4_bs_e))
    ]
