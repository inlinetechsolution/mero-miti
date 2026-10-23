<?php

namespace MeroMiti;

class FiscalQuarterRange
{
    public int $quarter;
    public string $name;
    public string $nepaliName;
    public BsDate $startBs;
    public BsDate $endBs;
    public AdDate $startAd;
    public AdDate $endAd;

    public function __construct(
        int $quarter,
        string $name,
        string $nepaliName,
        BsDate $startBs,
        BsDate $endBs,
        AdDate $startAd,
        AdDate $endAd
    ) {
        $this->quarter = $quarter;
        $this->name = $name;
        $this->nepaliName = $nepaliName;
        $this->startBs = $startBs;
        $this->endBs = $endBs;
        $this->startAd = $startAd;
        $this->endAd = $endAd;
    }
}
