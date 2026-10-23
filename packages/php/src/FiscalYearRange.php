<?php

namespace MeroMiti;

use DateTimeImmutable;

class FiscalYearRange
{
    public BsFiscalYear $fiscalYear;
    public BsDate $startBs;
    public BsDate $endBs;
    public AdDate $startAd;
    public AdDate $endAd;
    public DateTimeImmutable $startDate;
    public DateTimeImmutable $endDate;

    public function __construct(
        BsFiscalYear $fiscalYear,
        BsDate $startBs,
        BsDate $endBs,
        AdDate $startAd,
        AdDate $endAd,
        DateTimeImmutable $startDate,
        DateTimeImmutable $endDate
    ) {
        $this->fiscalYear = $fiscalYear;
        $this->startBs = $startBs;
        $this->endBs = $endBs;
        $this->startAd = $startAd;
        $this->endAd = $endAd;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
}
