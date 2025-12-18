## Book Set Management Backend

This backend implements the interview task for **school book inventory** with a focus on **Book Sets**.

It exposes APIs to manage:
- Boards (e.g., CBSE, ICSE)
- Mediums (e.g., English, Hindi)
- Classes (e.g., 1–12)
- Academic Years (e.g., 2024–2025)
- Books
- Book Sets and their items

---

### 1. Relational Database Design (Conceptual)

Conceptually, the data model looks like this (relational-style tables):

- **Board**
  - `id`
  - `name`

- **Medium**
  - `id`
  - `name`

- **Class**
  - `id`
  - `name`

- **AcademicYear**
  - `id`
  - `name` (e.g. "2024-2025")

- **Book**
  - `id`
  - `book_name`
  - `subject`
  - `publisher`

- **BookSet**
  - `id`
  - `board_id` → references `Board.id`
  - `medium_id` → references `Medium.id`
  - `class_id` → references `Class.id`
  - `year_id` → references `AcademicYear.id`
  - `set_name`

- **BookSetItem**
  - `id`
  - `book_set_id` → references `BookSet.id`
  - `book_id` → references `Book.id`
  - `quantity`

In MongoDB/Mongoose, these are modeled as collections with `ObjectId` references:
- `BookSet.board` → `Board`
- `BookSet.medium` → `Medium`
- `BookSet.class` → `Class`
- `BookSet.year` → `AcademicYear`
- `BookSet.items[].book` → `Book`

This design lets us:
- Keep master data (Board, Medium, Class, AcademicYear, Book) normalized.
- Reuse the same Book in many sets.
- Filter Book Sets easily by board, medium, class, year.

---

### 2. Why Separate BookSet and BookSetItem

We separate **BookSet** (header) from **BookSetItem** (line items) for these reasons:

- **One-to-many relationship**: one Book Set contains many books; each item has its own `quantity`.
- **Flexibility**: you can:
  - Add/remove books from a set without touching other sets.
  - Reuse the same book in multiple sets.
- **Clean queries**: it is easy to:
  - List all sets (just the header info).
  - Expand a single set to see its items.
- **Real-world alignment**: this mirrors how invoices/orders work: a header row (customer, date, etc.) and detail rows (items and quantities).

In the MongoDB implementation, `BookSetItem` is represented as an **embedded sub-document array** (`items`) inside `BookSet`, but conceptually it is the same as a separate `BookSetItem` table in a relational DB.

---

### 3. CRUD Operations in This Module

For each main entity (Board, Medium, Class, AcademicYear, Book, BookSet) we expose standard CRUD APIs:

- **Create**: `POST`  
  - Example (Book Set): `POST /api/book-set/create`  
  - Body:
    ```json
    {
      "board_id": "650000000000000000000001",
      "medium_id": "650000000000000000000002",
      "class_id": "650000000000000000000003",
      "year_id": "650000000000000000000004",
      "set_name": "Class 3 English Set",
      "books": [
        { "book_id": "650000000000000000000010", "quantity": 1 },
        { "book_id": "650000000000000000000012", "quantity": 1 }
      ]
    }
    ```

- **Read (list + filters)**: `GET`  
  - Example (Book Sets with filters):  
    `GET /api/book-set?board_id=...&medium_id=...&class_id=...&year_id=...`

- **Read (single)**: `GET /api/book-set/:id`

- **Update**: `PUT /api/book-set/:id`  
  - Body can update:
    - `board_id`, `medium_id`, `class_id`, `year_id`
    - `set_name`
    - `books` (add/remove/change quantities)

- **Delete**: `DELETE /api/book-set/:id`

All these operations are implemented in `controller/*.controller.js` and wired via `router/*Routes.js`.

---

### 4. Understanding of School Workflow

The typical admin workflow for school book management is:

1. **Setup master data**
   - Create Boards (CBSE, ICSE, State Board…)
   - Create Mediums (English, Hindi, Gujarati…)
   - Create Classes (1–12)
   - Create Academic Years (e.g. 2024–2025)
   - Create Books with `book_name`, `subject`, `publisher`

2. **Define Book Sets for a specific academic year**
   - For each combination of Board + Medium + Class + Academic Year:
     - Choose or create a **Set Name** (e.g. "Class 3 English Medium Set 2024–2025").
     - Select multiple Books from the master list.
     - Set a **quantity per book** (usually 1, but can be more).
   - The system stores this as a `BookSet` with child `BookSetItem` records.

3. **Use Book Sets operationally**
   - When new students are admitted, the admin or store:
     - Picks the Book Set based on the student’s Board, Medium, Class, and Year.
     - Uses the Book Set definition to know exactly which books (and how many) to issue or sell.
   - When the school changes syllabus:
     - Update the Book Set for the new Academic Year without losing history for previous years.

4. **Reporting and inventory**
   - Since Book Sets are well-structured:
     - It is easy to calculate total books required per Class/Board/Year.
     - It is easy to preview the contents of each Book Set from the admin panel.

This design is optimized for real school workflows where:
- Syllabus changes year to year.
- Different boards/mediums have different book combinations.
- Admins need a clear, reusable definition of which books belong to which class set.


