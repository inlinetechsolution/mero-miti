import 'package:flutter/material.dart';
import 'calendar_data.dart';
import 'converter.dart';
import 'formatter.dart';

class MeroMitiDateSelection {
  final BsDate bsDate;
  final DateTime adDate;
  final String locale;

  MeroMitiDateSelection({
    required this.bsDate,
    required this.adDate,
    this.locale = 'ne',
  });
}

/// Shows a responsive bottom sheet or dialog to select a Nepali Bikram Sambat date.
Future<MeroMitiDateSelection?> showMeroMitiDatePicker({
  required BuildContext context,
  BsDate? initialDate,
  String locale = 'ne', // 'ne' or 'en'
  bool? devanagari,
}) async {
  final now = DateTime.now();
  final todayBs = adToBs(now);
  final start = initialDate ?? todayBs;

  return showModalBottomSheet<MeroMitiDateSelection>(
    context: context,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (ctx) => _MeroMitiCalendarSheet(
      initialDate: start,
      today: todayBs,
      initialLocale: locale,
    ),
  );
}

class _MeroMitiCalendarSheet extends StatefulWidget {
  final BsDate initialDate;
  final BsDate today;
  final String initialLocale;

  const _MeroMitiCalendarSheet({
    required this.initialDate,
    required this.today,
    required this.initialLocale,
  });

  @override
  State<_MeroMitiCalendarSheet> createState() => _MeroMitiCalendarSheetState();
}

class _MeroMitiCalendarSheetState extends State<_MeroMitiCalendarSheet> {
  late int currentYear;
  late int currentMonth;
  late String currentLocale;
  BsDate? selectedDate;

  @override
  void initState() {
    super.initState();
    currentYear = widget.initialDate.year;
    currentMonth = widget.initialDate.month;
    currentLocale = widget.initialLocale;
    selectedDate = widget.initialDate;
  }

  void _prevMonth() {
    setState(() {
      currentMonth--;
      if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
      }
    });
  }

  void _nextMonth() {
    setState(() {
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    });
  }

  void _toggleLanguage() {
    setState(() {
      currentLocale = currentLocale == 'ne' ? 'en' : 'ne';
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final daysInMonth = getDaysInBsMonth(currentYear, currentMonth);
    final isNe = currentLocale == 'ne';

    // Get weekday of 1st day of month
    final firstDayAd = bsToAd(BsDate(year: currentYear, month: currentMonth, day: 1));
    final startWeekday = firstDayAd.weekday % 7; // 0 = Sun, 6 = Sat

    final monthNames = isNe ? nepaliMonthsNp : nepaliMonthsEn;
    final weekdayNames = isNe ? nepaliDaysShortNp : nepaliDaysShortEn;

    final yearStr = isNe ? toNepaliDigits(currentYear) : currentYear.toString();
    final headerTitle = '${monthNames[currentMonth - 1]} $yearStr';

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: theme.dividerColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Header (Month/Year navigators + Language Toggle)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left),
                  onPressed: _prevMonth,
                  tooltip: isNe ? 'अघिल्लो महिना' : 'Previous Month',
                ),
                Text(
                  headerTitle,
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.chevron_right),
                      onPressed: _nextMonth,
                      tooltip: isNe ? 'पछिल्लो महिना' : 'Next Month',
                    ),
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      onPressed: _toggleLanguage,
                      child: Text(
                        isNe ? 'EN' : 'नेपाली',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Weekday Headers
            Row(
              children: List.generate(7, (index) {
                final isSat = index == 6;
                return Expanded(
                  child: Center(
                    child: Text(
                      weekdayNames[index],
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSat ? Colors.red : theme.textTheme.bodySmall?.color,
                      ),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 8),

            // Calendar Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: startWeekday + daysInMonth,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 7,
                mainAxisSpacing: 4,
                crossAxisSpacing: 4,
              ),
              itemBuilder: (ctx, index) {
                if (index < startWeekday) {
                  return const SizedBox.shrink();
                }

                final day = index - startWeekday + 1;
                final weekday = index % 7;
                final isSat = weekday == 6;
                final isSelected = selectedDate != null &&
                    selectedDate!.year == currentYear &&
                    selectedDate!.month == currentMonth &&
                    selectedDate!.day == day;
                final isToday = widget.today.year == currentYear &&
                    widget.today.month == currentMonth &&
                    widget.today.day == day;

                final dayLabel = isNe ? toNepaliDigits(day) : day.toString();

                return InkWell(
                  onTap: () {
                    final picked = BsDate(year: currentYear, month: currentMonth, day: day);
                    final ad = bsToAd(picked);
                    Navigator.of(context).pop(MeroMitiDateSelection(
                      bsDate: picked,
                      adDate: ad,
                      locale: currentLocale,
                    ));
                  },
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? theme.colorScheme.primary : null,
                      border: isToday && !isSelected
                          ? Border.all(color: theme.colorScheme.primary)
                          : null,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      dayLabel,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: isSelected || isToday ? FontWeight.bold : FontWeight.normal,
                        color: isSelected
                            ? Colors.white
                            : (isSat ? Colors.red : theme.textTheme.bodyMedium?.color),
                      ),
                    ),
                  ),
                );
              },
            ),
            const Divider(height: 24),

            // Footer
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton.icon(
                  icon: const Icon(Icons.today, size: 18),
                  label: Text(
                    isNe
                        ? 'आज (${toNepaliDigits(widget.today.day)} ${nepaliMonthsNp[widget.today.month - 1]})'
                        : 'Today (${widget.today.day} ${nepaliMonthsEn[widget.today.month - 1]})',
                  ),
                  onPressed: () {
                    final ad = bsToAd(widget.today);
                    Navigator.of(context).pop(MeroMitiDateSelection(
                      bsDate: widget.today,
                      adDate: ad,
                      locale: currentLocale,
                    ));
                  },
                ),
                Text(
                  isNe ? '🌿 मेरो मिति' : '🌿 Mero Miti',
                  style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
