"""
Pydantic Custom Type and Validator for FastAPI.
"""

from typing import Any, Callable, Generator
from ..core import parse_bs_date, bs_to_ad, BsDate

try:
    from pydantic import GetCoreSchemaHandler
    from pydantic_core import CoreSchema, core_schema

    class BsDateStr(str):
        """
        Pydantic v2 compatible string field that validates B.S. date format
        and ensures the date is mathematically valid in the Nepali calendar.
        """
        @classmethod
        def __get_pydantic_core_schema__(
            cls, source_type: Any, handler: GetCoreSchemaHandler
        ) -> CoreSchema:
            return core_schema.no_info_after_validator_function(
                cls.validate,
                core_schema.str_schema(),
            )

        @classmethod
        def validate(cls, v: str) -> "BsDateStr":
            res = parse_bs_date(v)
            if not res.is_valid:
                raise ValueError(res.error or "Invalid Nepali Bikram Sambat date")
            return cls(v)

        def to_ad_date(self):
            res = parse_bs_date(self)
            if res.is_valid and res.parsed:
                return bs_to_ad(res.parsed)
            return None

except ImportError:
    # Pydantic v1 fallback
    class BsDateStr(str):
        @classmethod
        def __get_validators__(cls) -> Generator[Callable, None, None]:
            yield cls.validate

        @classmethod
        def validate(cls, v: str) -> "BsDateStr":
            res = parse_bs_date(v)
            if not res.is_valid:
                raise ValueError(res.error or "Invalid Nepali Bikram Sambat date")
            return cls(v)

        def to_ad_date(self):
            res = parse_bs_date(self)
            if res.is_valid and res.parsed:
                return bs_to_ad(res.parsed)
            return None
