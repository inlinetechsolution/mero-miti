<?php

namespace MeroMiti;

class BsFiscalYear
{
    public int $startBsYear;
    public int $endBsYear;
    public string $code;
    public string $nepaliCode;

    public function __construct(int $startBsYear, int $endBsYear, string $code, string $nepaliCode)
    {
        $this->startBsYear = $startBsYear;
        $this->endBsYear = $endBsYear;
        $this->code = $code;
        $this->nepaliCode = $nepaliCode;
    }
}
