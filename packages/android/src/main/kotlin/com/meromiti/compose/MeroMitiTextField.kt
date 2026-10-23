package com.meromiti.compose

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.meromiti.core.AdDate
import com.meromiti.core.BsDate
import com.meromiti.core.MeroMitiCore
import java.time.LocalDate

@Composable
fun MeroMitiTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    format: String = "DD/MM/YYYY",
    locale: String = "ne",
    primaryColor: Color = Color(0xFF10B981),
    onBsDateChange: ((BsDate) -> Unit)? = null,
    onAdDateChange: ((LocalDate) -> Unit)? = null
) {
    var showDialog by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var currentBsDate by remember { mutableStateOf<BsDate?>(null) }

    fun processInput(rawText: String) {
        val clean = MeroMitiCore.toEnglishDigits(rawText).filter { it.isDigit() }
        val sep = if (format.contains('.')) '.' else '/'
        val masked = buildString {
            if (format.startsWith("YYYY")) {
                if (clean.isNotEmpty()) append(clean.take(4))
                if (clean.length > 4) append(sep).append(clean.substring(4, minOf(6, clean.length)))
                if (clean.length > 6) append(sep).append(clean.substring(6, minOf(8, clean.length)))
            } else {
                if (clean.isNotEmpty()) append(clean.take(2))
                if (clean.length > 2) append(sep).append(clean.substring(2, minOf(4, clean.length)))
                if (clean.length > 4) append(sep).append(clean.substring(4, minOf(8, clean.length)))
            }
        }
        onValueChange(masked)

        if (masked.length >= 10) {
            val parts = masked.split(sep)
            if (parts.size == 3) {
                val d: Int; val m: Int; val y: Int
                if (format.startsWith("YYYY")) {
                    y = parts[0].toIntOrNull() ?: 0
                    m = parts[1].toIntOrNull() ?: 0
                    d = parts[2].toIntOrNull() ?: 0
                } else {
                    d = parts[0].toIntOrNull() ?: 0
                    m = parts[1].toIntOrNull() ?: 0
                    y = parts[2].toIntOrNull() ?: 0
                }
                val bs = BsDate(y, m, d)
                val res = MeroMitiCore.validateBsDate(bs, locale)
                if (res.isValid) {
                    errorMessage = null
                    currentBsDate = bs
                    onBsDateChange?.invoke(bs)
                    onAdDateChange?.invoke(MeroMitiCore.bsToAd(bs))
                } else {
                    errorMessage = res.error
                }
            }
        } else {
            errorMessage = null
        }
    }

    Column(modifier = modifier) {
        OutlinedTextField(
            value = value,
            onValueChange = { processInput(it) },
            label = label?.let { { Text(it) } },
            placeholder = { Text(format) },
            isError = errorMessage != null,
            supportingText = errorMessage?.let { { Text(it, color = MaterialTheme.colorScheme.error) } },
            leadingIcon = {
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = primaryColor.copy(alpha = 0.12f),
                    modifier = Modifier.padding(start = 8.dp, end = 4.dp)
                ) {
                    Text(
                        text = if (locale == "ne") "वि.सं." else "B.S.",
                        color = primaryColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            },
            trailingIcon = {
                IconButton(onClick = { showDialog = true }) {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = "पात्रो हेर्नुहोस् (Open Calendar)",
                        tint = primaryColor
                    )
                }
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        if (showDialog) {
            MeroMitiDatePickerDialog(
                initialDate = currentBsDate,
                onDismissRequest = { showDialog = false },
                onDateSelected = { selectedBs ->
                    currentBsDate = selectedBs
                    val formatted = MeroMitiCore.formatBsDate(selectedBs, format = format)
                    onValueChange(formatted)
                    errorMessage = null
                    onBsDateChange?.invoke(selectedBs)
                    onAdDateChange?.invoke(MeroMitiCore.bsToAd(selectedBs))
                },
                primaryColor = primaryColor,
                initialLocale = locale
            )
        }
    }
}
