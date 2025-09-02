Návrhy na zlepšenie

Indexy pre výkon
Pri sessions by bolo vhodné pridať index na expires_at, aby sa dali rýchlo mazať expirované sessions:

@@index([expires_at])


Consistency v dátach používateľov

User má len email a name, ale Membership rieši auth metódy (rfid, qr, usb).
→ Ak plánuješ multi-org login (jeden user, viac memberships), je to správne.
→ Ale ak je napr. RFID striktne viazané na usera a nie na konkrétnu organizáciu, patrilo by skôr do User.

Task/TaskProgress dizajn

is_completed v Task môže byť redundantné, lebo stav rieši TaskProgress.
→ Ak chceš mať rýchly lookup, nechaj to tam, ale bude treba sync logiku (pri zmene progress sa update-ne aj is_completed).

Enumy vs. texty

priority v Task je String?.
→ Ak sú priority fixné (low, medium, high, urgent), lepšie by bolo enum TaskPriority.

Organization.type

Aktuálne String. Ak vieš, že bude len pár druhov (firma, dielňa, partner…), radšej enum, inak to bude diverzovať.


---------
