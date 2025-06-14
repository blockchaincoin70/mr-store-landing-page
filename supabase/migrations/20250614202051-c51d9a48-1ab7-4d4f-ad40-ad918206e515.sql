
-- Create a table for product inventory (POS-specific data)
CREATE TABLE public.product_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  selling_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  reorder_level INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id)
);

-- Create a table for sales transactions
CREATE TABLE public.sales_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_number TEXT NOT NULL UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  customer_name TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for sales transaction items
CREATE TABLE public.sales_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.sales_transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_product_inventory_product_id ON public.product_inventory(product_id);
CREATE INDEX idx_sales_transactions_created_at ON public.sales_transactions(created_at);
CREATE INDEX idx_sales_items_transaction_id ON public.sales_items(transaction_id);
CREATE INDEX idx_sales_items_product_id ON public.sales_items(product_id);

-- Create a function to generate transaction numbers
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TEXT AS $$
DECLARE
    trans_number TEXT;
BEGIN
    trans_number := 'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('transaction_number_seq')::TEXT, 4, '0');
    RETURN trans_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for transaction numbers
CREATE SEQUENCE IF NOT EXISTS transaction_number_seq START 1;

-- Add RLS policies for product_inventory
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.product_inventory
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.product_inventory
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.product_inventory
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON public.product_inventory
    FOR DELETE USING (true);

-- Add RLS policies for sales_transactions
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.sales_transactions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.sales_transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.sales_transactions
    FOR UPDATE USING (true);

-- Add RLS policies for sales_items
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.sales_items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.sales_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.sales_items
    FOR UPDATE USING (true);
