--
-- PostgreSQL database dump
--

\restrict cD7Unvl4Nkqdh0cAlOEPFcBEjhwDoi0hiJFjVXKF94YgPPBXQ5PGx4ekpjjwvZk

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SJIS';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_invites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_invites (
    invite_id integer NOT NULL,
    admin_id integer NOT NULL,
    email character varying(254) NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    invite_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    accepted_at timestamp without time zone,
    CONSTRAINT invite_status_check CHECK (((invite_status)::text = ANY ((ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'EXPIRED'::character varying])::text[]))),
    CONSTRAINT invite_time_check CHECK ((expires_at > sent_at)),
    CONSTRAINT invite_token_hash_check CHECK (((token_hash)::text ~ '^[0-9a-f]{64}$'::text))
);


--
-- Name: admin_invites_invite_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.admin_invites ALTER COLUMN invite_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.admin_invites_invite_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(254) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT admin_name_length CHECK (((char_length((name)::text) >= 1) AND (char_length((name)::text) <= 50))),
    CONSTRAINT admin_role_check CHECK (((role)::text = ANY ((ARRAY['OWNER'::character varying, 'ADMIN'::character varying])::text[])))
);


--
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.admins ALTER COLUMN admin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.admins_admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: application_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_images (
    application_image_id integer NOT NULL,
    application_id integer NOT NULL,
    image_path character varying(500) NOT NULL,
    image_number integer NOT NULL,
    CONSTRAINT application_image_number_check CHECK (((image_number >= 1) AND (image_number <= 4)))
);


--
-- Name: application_images_application_image_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.application_images ALTER COLUMN application_image_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.application_images_application_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    application_id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    admin_id integer,
    reason character varying(1000) CONSTRAINT applications_description_not_null NOT NULL,
    application_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_at timestamp without time zone,
    CONSTRAINT application_status_check CHECK (((application_status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.applications ALTER COLUMN application_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.applications_application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: email_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verifications (
    verification_id integer NOT NULL,
    email character varying(254) NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    verified_at timestamp without time zone,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT verification_time_check CHECK ((expires_at > sent_at)),
    CONSTRAINT verification_token_hash_check CHECK (((token_hash)::text ~ '^[0-9a-f]{64}$'::text))
);


--
-- Name: email_verifications_verification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.email_verifications ALTER COLUMN verification_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.email_verifications_verification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: handovers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.handovers (
    handover_id integer NOT NULL,
    application_id integer NOT NULL,
    admin_id integer NOT NULL,
    handed_over_at timestamp without time zone,
    pickup_start_at timestamp without time zone,
    pickup_end_at timestamp without time zone,
    display_end_at timestamp without time zone,
    CONSTRAINT pickup_period_check CHECK ((pickup_end_at >= pickup_start_at))
);


--
-- Name: handovers_handover_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.handovers ALTER COLUMN handover_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.handovers_handover_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lost_item_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lost_item_posts (
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    admin_id integer,
    item_name character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    description character varying(200),
    location character varying(100) NOT NULL,
    found_at timestamp without time zone NOT NULL,
    storage_location character varying(100),
    item_status character varying(20) DEFAULT 'NOT_ARRIVED'::character varying NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT item_status_check CHECK (((item_status)::text = ANY ((ARRAY['NOT_ARRIVED'::character varying, 'ARRIVED'::character varying, 'RETURNED'::character varying, 'DISPOSED'::character varying])::text[])))
);


--
-- Name: lost_item_posts_post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.lost_item_posts ALTER COLUMN post_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lost_item_posts_post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    message_id integer NOT NULL,
    handover_id integer NOT NULL,
    message character varying(140) NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT message_length_check CHECK (((char_length((message)::text) >= 1) AND (char_length((message)::text) <= 140)))
);


--
-- Name: messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.messages ALTER COLUMN message_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer NOT NULL,
    notification_type character varying(30) NOT NULL,
    title character varying(100) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.notifications ALTER COLUMN notification_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: post_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_images (
    post_image_id integer NOT NULL,
    post_id integer NOT NULL,
    image_path character varying(500) NOT NULL,
    image_number integer NOT NULL,
    CONSTRAINT image_number_check CHECK (((image_number >= 1) AND (image_number <= 4)))
);


--
-- Name: post_images_post_image_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.post_images ALTER COLUMN post_image_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.post_images_post_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    nickname character varying(20) NOT NULL,
    icon_number integer NOT NULL,
    email character varying(254) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT nickname_length CHECK (((char_length((nickname)::text) >= 1) AND (char_length((nickname)::text) <= 20)))
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: admin_invites admin_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_invites
    ADD CONSTRAINT admin_invites_pkey PRIMARY KEY (invite_id);


--
-- Name: admin_invites admin_invites_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_invites
    ADD CONSTRAINT admin_invites_token_hash_key UNIQUE (token_hash);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- Name: application_images application_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_images
    ADD CONSTRAINT application_images_pkey PRIMARY KEY (application_image_id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (application_id);


--
-- Name: email_verifications email_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verifications
    ADD CONSTRAINT email_verifications_pkey PRIMARY KEY (verification_id);


--
-- Name: email_verifications email_verifications_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verifications
    ADD CONSTRAINT email_verifications_token_hash_key UNIQUE (token_hash);


--
-- Name: handovers handovers_application_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.handovers
    ADD CONSTRAINT handovers_application_id_key UNIQUE (application_id);


--
-- Name: handovers handovers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.handovers
    ADD CONSTRAINT handovers_pkey PRIMARY KEY (handover_id);


--
-- Name: lost_item_posts lost_item_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lost_item_posts
    ADD CONSTRAINT lost_item_posts_pkey PRIMARY KEY (post_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: post_images post_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_images
    ADD CONSTRAINT post_images_pkey PRIMARY KEY (post_image_id);


--
-- Name: application_images unique_application_image_number; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_images
    ADD CONSTRAINT unique_application_image_number UNIQUE (application_id, image_number);


--
-- Name: post_images unique_post_image_number; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_images
    ADD CONSTRAINT unique_post_image_number UNIQUE (post_id, image_number);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: applications fk_application_admin; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT fk_application_admin FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id);


--
-- Name: application_images fk_application_image; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_images
    ADD CONSTRAINT fk_application_image FOREIGN KEY (application_id) REFERENCES public.applications(application_id) ON DELETE CASCADE;


--
-- Name: applications fk_application_post; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT fk_application_post FOREIGN KEY (post_id) REFERENCES public.lost_item_posts(post_id);


--
-- Name: applications fk_application_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT fk_application_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: handovers fk_handover_admin; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.handovers
    ADD CONSTRAINT fk_handover_admin FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id);


--
-- Name: handovers fk_handover_application; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.handovers
    ADD CONSTRAINT fk_handover_application FOREIGN KEY (application_id) REFERENCES public.applications(application_id);


--
-- Name: admin_invites fk_invite_admin; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_invites
    ADD CONSTRAINT fk_invite_admin FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id);


--
-- Name: messages fk_message_handover; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_message_handover FOREIGN KEY (handover_id) REFERENCES public.handovers(handover_id);


--
-- Name: notifications fk_notification_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: lost_item_posts fk_post_admin; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lost_item_posts
    ADD CONSTRAINT fk_post_admin FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id);


--
-- Name: post_images fk_post_image; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_images
    ADD CONSTRAINT fk_post_image FOREIGN KEY (post_id) REFERENCES public.lost_item_posts(post_id) ON DELETE CASCADE;


--
-- Name: lost_item_posts fk_post_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lost_item_posts
    ADD CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict cD7Unvl4Nkqdh0cAlOEPFcBEjhwDoi0hiJFjVXKF94YgPPBXQ5PGx4ekpjjwvZk

