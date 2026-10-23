package com.meromiti.compose

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.meromiti.core.BsDate
import com.meromiti.core.MeroMitiCore
import java.time.LocalDate

@Composable
fun MeroMitiDatePickerDialog(
    initialDate: BsDate? = null,
    onDismissRequest: () -> Unit,
    onDateSelected: (BsDate) -> Unit,
    primaryColor: Color = Color(0xFF10B981),
    initialLocale: String = "ne"
) {
    val todayBs = remember { MeroMitiCore.adToBs(LocalDate.now()) }
    var selectedDate by remember { mutableStateOf(initialDate ?: todayBs) }
    var displayedYear by remember { mutableIntStateOf(selectedDate.year) }
    var displayedMonth by remember { mutableIntStateOf(selectedDate.month) }
    var currentLocale by remember { mutableStateOf(initialLocale) }

    val isNepali = currentLocale == "ne"
    val monthNames = if (isNepali) MeroMitiCore.NEPALI_MONTHS_NP else MeroMitiCore.NEPALI_MONTHS_EN
    val weekdayNames = if (isNepali) MeroMitiCore.NEPALI_DAYS_SHORT_NP else MeroMitiCore.NEPALI_DAYS_SHORT_EN

    val daysInMonth = MeroMitiCore.getDaysInBsMonth(displayedYear, displayedMonth)
    val firstDayAd = MeroMitiCore.bsToAd(BsDate(displayedYear, displayedMonth, 1))
    // DayOfWeek in java.time: Monday=1 ... Sunday=7 -> we want Sunday=0 ... Saturday=6
    val startWeekday = firstDayAd.dayOfWeek.value % 7

    Dialog(onDismissRequest = onDismissRequest) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp,
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .fillMaxWidth()
            ) {
                // Header: Navigation & Month/Year info
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = {
                            if (displayedMonth > 1) {
                                displayedMonth--
                            } else {
                                displayedMonth = 12
                                displayedYear--
                            }
                        }
                    ) {
                        Text("◀", fontSize = 16.sp, color = primaryColor)
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "${monthNames[displayedMonth - 1]} " +
                                if (isNepali) MeroMitiCore.toNepaliDigits(displayedYear) else "$displayedYear",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    IconButton(
                        onClick = {
                            if (displayedMonth < 12) {
                                displayedMonth++
                            } else {
                                displayedMonth = 1
                                displayedYear++
                            }
                        }
                    ) {
                        Text("▶", fontSize = 16.sp, color = primaryColor)
                    }

                    // Language Toggle Pill
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = primaryColor.copy(alpha = 0.15f),
                        modifier = Modifier.clickable {
                            currentLocale = if (isNepali) "en" else "ne"
                        }
                    ) {
                        Text(
                            text = if (isNepali) "EN" else "ने",
                            color = primaryColor,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Weekday headers
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    weekdayNames.forEachIndexed { index, name ->
                        Text(
                            text = name,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = if (index == 6) Color(0xFFEF4444) else MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Days Grid (6 rows * 7 columns max)
                val totalCells = startWeekday + daysInMonth
                val totalRows = (totalCells + 6) / 7

                LazyVerticalGrid(
                    columns = GridCells.Fixed(7),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height((totalRows * 42).dp),
                    userScrollEnabled = false
                ) {
                    // Empty cells
                    items(startWeekday) {
                        Box(modifier = Modifier.size(40.dp))
                    }

                    // Days
                    items(daysInMonth) { dayIndex ->
                        val day = dayIndex + 1
                        val weekday = (startWeekday + dayIndex) % 7
                        val isSaturday = weekday == 6
                        val isSelected = selectedDate.year == displayedYear &&
                            selectedDate.month == displayedMonth &&
                            selectedDate.day == day
                        val isToday = todayBs.year == displayedYear &&
                            todayBs.month == displayedMonth &&
                            todayBs.day == day

                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .then(
                                    when {
                                        isSelected -> Modifier.background(primaryColor)
                                        isToday -> Modifier.border(1.dp, primaryColor, CircleShape)
                                        else -> Modifier
                                    }
                                )
                                .clickable {
                                    selectedDate = BsDate(displayedYear, displayedMonth, day)
                                }
                        ) {
                            Text(
                                text = if (isNepali) MeroMitiCore.toNepaliDigits(day) else "$day",
                                fontSize = 14.sp,
                                fontWeight = if (isSelected || isToday) FontWeight.Bold else FontWeight.Normal,
                                color = when {
                                    isSelected -> Color.White
                                    isSaturday -> Color(0xFFEF4444)
                                    else -> MaterialTheme.colorScheme.onSurface
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Footer Actions: Today & Confirm
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(
                        onClick = {
                            selectedDate = todayBs
                            displayedYear = todayBs.year
                            displayedMonth = todayBs.month
                        }
                    ) {
                        Text(
                            text = if (isNepali) "आज (${MeroMitiCore.toNepaliDigits(todayBs.day)} ${monthNames[todayBs.month - 1]})" else "Today",
                            color = primaryColor,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Row {
                        TextButton(onClick = onDismissRequest) {
                            Text(if (isNepali) "रद्द" else "Cancel")
                        }
                        Button(
                            onClick = {
                                onDateSelected(selectedDate)
                                onDismissRequest()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = primaryColor)
                        ) {
                            Text(if (isNepali) "छान्नुहोस्" else "Select")
                        }
                    }
                }
            }
        }
    }
}
