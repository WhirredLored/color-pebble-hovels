-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN', 'ESTIMATOR');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('LEAD', 'ESTIMATING', 'ACTIVE', 'WARRANTY', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('PAINTING', 'RESTORATION', 'CNC_CARVING');

-- CreateEnum
CREATE TYPE "EstimateStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'SIGNED');

-- CreateEnum
CREATE TYPE "ChangeOrderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LineItemCategory" AS ENUM ('MATERIALS', 'LABOR', 'CNC_MACHINE_TIME', 'EQUIPMENT', 'SUBCONTRACTOR', 'PERMITS', 'OVERHEAD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "supabase_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "company_name" TEXT,
    "phone" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "project_status" "ProjectStatus" NOT NULL DEFAULT 'LEAD',
    "project_type" "ProjectType" NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estimates" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" "EstimateStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT,
    "notes" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_rate" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "valid_until" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_items" (
    "id" TEXT NOT NULL,
    "estimate_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "labor_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "category" "LineItemCategory" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "estimate_id" TEXT,
    "invoice_number" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "amount_due" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "amount_paid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "due_date" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "stripe_payment_intent" TEXT,
    "stripe_invoice_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "estimate_id" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "docusign_envelope_id" TEXT,
    "terms" TEXT,
    "signed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_orders" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "estimate_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ChangeOrderStatus" NOT NULL DEFAULT 'PENDING',
    "amount_delta" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "requested_by" TEXT,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "change_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranties" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "coverage_start" TIMESTAMP(3) NOT NULL,
    "coverage_end" TIMESTAMP(3) NOT NULL,
    "terms" TEXT,
    "claim_filed" BOOLEAN NOT NULL DEFAULT false,
    "claim_details" TEXT,
    "claim_filed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_inquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_id_key" ON "users"("supabase_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "projects_user_id_idx" ON "projects"("user_id");

-- CreateIndex
CREATE INDEX "projects_project_status_idx" ON "projects"("project_status");

-- CreateIndex
CREATE INDEX "projects_project_type_idx" ON "projects"("project_type");

-- CreateIndex
CREATE INDEX "estimates_project_id_idx" ON "estimates"("project_id");

-- CreateIndex
CREATE INDEX "estimates_status_idx" ON "estimates"("status");

-- CreateIndex
CREATE INDEX "line_items_estimate_id_idx" ON "line_items"("estimate_id");

-- CreateIndex
CREATE INDEX "line_items_category_idx" ON "line_items"("category");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_project_id_idx" ON "invoices"("project_id");

-- CreateIndex
CREATE INDEX "invoices_estimate_id_idx" ON "invoices"("estimate_id");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_stripe_payment_intent_idx" ON "invoices"("stripe_payment_intent");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_estimate_id_key" ON "contracts"("estimate_id");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "contracts"("status");

-- CreateIndex
CREATE INDEX "contracts_docusign_envelope_id_idx" ON "contracts"("docusign_envelope_id");

-- CreateIndex
CREATE INDEX "change_orders_project_id_idx" ON "change_orders"("project_id");

-- CreateIndex
CREATE INDEX "change_orders_estimate_id_idx" ON "change_orders"("estimate_id");

-- CreateIndex
CREATE INDEX "change_orders_status_idx" ON "change_orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "warranties_project_id_key" ON "warranties"("project_id");

-- CreateIndex
CREATE INDEX "warranties_coverage_end_idx" ON "warranties"("coverage_end");

-- CreateIndex
CREATE INDEX "contact_inquiries_created_at_idx" ON "contact_inquiries"("created_at");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_items" ADD CONSTRAINT "line_items_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_orders" ADD CONSTRAINT "change_orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_orders" ADD CONSTRAINT "change_orders_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

