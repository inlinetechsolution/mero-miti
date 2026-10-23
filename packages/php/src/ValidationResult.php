<?php

namespace MeroMiti;

class ValidationResult
{
    public bool $isValid;
    public ?string $error;
    public ?BsDate $parsed;

    public function __construct(bool $isValid, ?string $error = null, ?BsDate $parsed = null)
    {
        $this->isValid = $isValid;
        $this->error = $error;
        $this->parsed = $parsed;
    }
}
