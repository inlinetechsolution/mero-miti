<?php

namespace MeroMiti\Laravel;

use MeroMiti\MeroMiti;

/**
 * Laravel Validation Rule for Bikram Sambat Dates.
 * Compatible with Laravel 8, 9, 10, and 11.
 */
class ValidBsDate
{
    protected string $format;
    protected string $locale;

    public function __construct(string $format = 'DD/MM/YYYY', string $locale = 'ne')
    {
        $this->format = $format;
        $this->locale = $locale;
    }

    /**
     * Determine if the validation rule passes.
     */
    public function passes($attribute, $value): bool
    {
        if (!$value) {
            return false;
        }

        $res = MeroMiti::parseBsDate((string)$value, $this->format, $this->locale);
        return $res->isValid;
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return $this->locale === 'ne'
            ? ':attribute अमान्य नेपाली (वि.सं.) मिति हो।'
            : 'The :attribute is not a valid Nepali (B.S.) date.';
    }
}
