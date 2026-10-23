import 'package:flutter/material.dart';
import 'calendar_data.dart';
import 'formatter.dart';
import 'mero_miti_dialog.dart';

/// A companion Flutter text input field with calendar icon suffix and live BS validation.
class MeroMitiTextField extends StatefulWidget {
  final BsDate? initialDate;
  final ValueChanged<MeroMitiDateSelection>? onDateChanged;
  final String format;
  final bool devanagari;
  final InputDecoration? decoration;
  final String? labelText;

  const MeroMitiTextField({
    Key? key,
    this.initialDate,
    this.onDateChanged,
    this.format = 'DD/MM/YYYY',
    this.devanagari = false,
    this.decoration,
    this.labelText,
  }) : super(key: key);

  @override
  State<MeroMitiTextField> createState() => _MeroMitiTextFieldState();
}

class _MeroMitiTextFieldState extends State<MeroMitiTextField> {
  late TextEditingController _controller;
  BsDate? _selectedDate;

  @override
  void initState() {
    super.initState();
    _selectedDate = widget.initialDate;
    final initialText = widget.initialDate != null
        ? formatBsDate(widget.initialDate!, format: widget.format, devanagari: widget.devanagari)
        : '';
    _controller = TextEditingController(text: initialText);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _openPicker() async {
    final result = await showMeroMitiDatePicker(
      context: context,
      initialDate: _selectedDate,
      devanagari: widget.devanagari,
    );

    if (result != null) {
      setState(() {
        _selectedDate = result.bsDate;
        _controller.text = formatBsDate(
          result.bsDate,
          format: widget.format,
          devanagari: widget.devanagari,
        );
      });
      if (widget.onDateChanged != null) {
        widget.onDateChanged!(result);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: _controller,
      readOnly: true,
      onTap: _openPicker,
      decoration: (widget.decoration ?? const InputDecoration()).copyWith(
        labelText: widget.labelText ?? 'नेपाली मिति (B.S.)',
        suffixIcon: IconButton(
          icon: const Icon(Icons.calendar_month),
          onPressed: _openPicker,
          tooltip: 'पात्रो हेर्नुहोस्',
        ),
      ),
    );
  }
}
