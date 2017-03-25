//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Import the Tableau Data Extract API constants and methods.       //
// MODIFICATION: XIYAO YANG                                                  //
//---------------------------------------------------------------------------//

using System;
using System.IO;
using System.Runtime.InteropServices;
using LeafWCFRest.Utility;

namespace Tableau
{
    public static class DataExtractAPILocation
    {
        /// <summary>
        /// User setable folder for 32 bit TDE API
        /// </summary>
        public static string TDE32Folder;
        /// <summary>
        /// User setable folder for 64 bit TDE API
        /// </summary>
        public static string TDE64Folder;
    }

    internal static class DataExtractAPI
    {
        #region TAB_TYPE
        public static readonly Int32 TAB_TYPE_Integer;
        public static readonly Int32 TAB_TYPE_Double;
        public static readonly Int32 TAB_TYPE_Boolean;
        public static readonly Int32 TAB_TYPE_Date;
        public static readonly Int32 TAB_TYPE_DateTime;
        public static readonly Int32 TAB_TYPE_Duration;
        public static readonly Int32 TAB_TYPE_CharString;
        public static readonly Int32 TAB_TYPE_UnicodeString;
        #endregion

        #region TAB_RESULT
        public static readonly Int32 TAB_RESULT_Success;
        public static readonly Int32 TAB_RESULT_OutOfMemory;
        public static readonly Int32 TAB_RESULT_PermissionDenied;
        public static readonly Int32 TAB_RESULT_InvalidFile;
        public static readonly Int32 TAB_RESULT_FileExists;
        public static readonly Int32 TAB_RESULT_TooManyFiles;
        public static readonly Int32 TAB_RESULT_FileNotFound;
        public static readonly Int32 TAB_RESULT_DiskFull;
        public static readonly Int32 TAB_RESULT_DirectoryNotEmpty;
        public static readonly Int32 TAB_RESULT_NoSuchDatabase;
        public static readonly Int32 TAB_RESULT_QueryError;
        public static readonly Int32 TAB_RESULT_NullArgument;
        public static readonly Int32 TAB_RESULT_DataEngineError;
        public static readonly Int32 TAB_RESULT_Cancelled;
        public static readonly Int32 TAB_RESULT_BadIndex;
        public static readonly Int32 TAB_RESULT_ProtocolError;
        public static readonly Int32 TAB_RESULT_NetworkError;
        public static readonly Int32 TAB_RESULT_InternalError;
        public static readonly Int32 TAB_RESULT_WrongType;
        public static readonly Int32 TAB_RESULT_UsageError;
        public static readonly Int32 TAB_RESULT_InvalidArgument;
        public static readonly Int32 TAB_RESULT_BadHandle;
        public static readonly Int32 TAB_RESULT_UnknownError;
        #endregion

        #region TAB_COLLATION
        public static readonly Int32 TAB_COLLATION_Binary;
        public static readonly Int32 TAB_COLLATION_ar;
        public static readonly Int32 TAB_COLLATION_cs;
        public static readonly Int32 TAB_COLLATION_cs_CI;
        public static readonly Int32 TAB_COLLATION_cs_CI_AI;
        public static readonly Int32 TAB_COLLATION_da;
        public static readonly Int32 TAB_COLLATION_de;
        public static readonly Int32 TAB_COLLATION_el;
        public static readonly Int32 TAB_COLLATION_en_GB;
        public static readonly Int32 TAB_COLLATION_en_US;
        public static readonly Int32 TAB_COLLATION_en_US_CI;
        public static readonly Int32 TAB_COLLATION_es;
        public static readonly Int32 TAB_COLLATION_es_CI_AI;
        public static readonly Int32 TAB_COLLATION_et;
        public static readonly Int32 TAB_COLLATION_fi;
        public static readonly Int32 TAB_COLLATION_fr_CA;
        public static readonly Int32 TAB_COLLATION_fr_FR;
        public static readonly Int32 TAB_COLLATION_fr_FR_CI_AI;
        public static readonly Int32 TAB_COLLATION_he;
        public static readonly Int32 TAB_COLLATION_hu;
        public static readonly Int32 TAB_COLLATION_is;
        public static readonly Int32 TAB_COLLATION_it;
        public static readonly Int32 TAB_COLLATION_ja;
        public static readonly Int32 TAB_COLLATION_ja_JIS;
        public static readonly Int32 TAB_COLLATION_ko;
        public static readonly Int32 TAB_COLLATION_lt;
        public static readonly Int32 TAB_COLLATION_lv;
        public static readonly Int32 TAB_COLLATION_nl_NL;
        public static readonly Int32 TAB_COLLATION_nn;
        public static readonly Int32 TAB_COLLATION_pl;
        public static readonly Int32 TAB_COLLATION_pt_BR;
        public static readonly Int32 TAB_COLLATION_pt_BR_CI_AI;
        public static readonly Int32 TAB_COLLATION_pt_PT;
        public static readonly Int32 TAB_COLLATION_root;
        public static readonly Int32 TAB_COLLATION_ru;
        public static readonly Int32 TAB_COLLATION_sl;
        public static readonly Int32 TAB_COLLATION_sv_FI;
        public static readonly Int32 TAB_COLLATION_sv_SE;
        public static readonly Int32 TAB_COLLATION_tr;
        public static readonly Int32 TAB_COLLATION_uk;
        public static readonly Int32 TAB_COLLATION_vi;
        public static readonly Int32 TAB_COLLATION_zh_Hans_CN;
        public static readonly Int32 TAB_COLLATION_zh_Hant_TW;
        #endregion

        #region General
        /// <summary>
        /// Get the error message corresponding to the error from the last API call.
        /// </summary>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabGetLastErrorMessage", PreserveSig = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr TabGetLastErrorMessage_API();
        public static String TabGetLastErrorMessage()
        {
            IntPtr msgPtr = TabGetLastErrorMessage_API();
            if (msgPtr == IntPtr.Zero)
                return (null);
            return (System.Runtime.InteropServices.Marshal.PtrToStringUni(msgPtr));
        }

        /// <summary>
        /// Shutdown the API engine.
        /// </summary>
        [DllImport("DataExtract.dll", EntryPoint = "TabShutdown", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern void TabShutdown();
        #endregion

        #region TableDefinition
        // Represents a collection of columns, or more specifically name/type pairs.

        /// <summary>
        /// Creates an empty copy of a TableDefinition object, which represent a collection of columns.
        /// </summary>
        /// <param name="hwnd"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionCreate", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionCreate([Out] out IntPtr handle);

        /// <summary>
        /// Closes the TableDefinition object and frees associated memory.
        /// </summary>
        /// <param name="handle"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionClose", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionClose(IntPtr handle);

        /// <summary>
        /// Gets the current default collation; if unspecified, default is binary.
        /// </summary>
        /// <param name="TableDefinition"></param>
        /// <param name="retval"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionGetDefaultCollation", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionGetDefaultCollation(IntPtr TableDefinition, [Out] out Int32 retval);

        /// <summary>
        /// Sets the default collation for added string columns.
        /// </summary>
        /// <param name="TableDefinition"></param>
        /// <param name="collation"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionSetDefaultCollation", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionSetDefaultCollation(IntPtr TableDefinition, Int32 collation);

        /// <summary>
        /// Adds a column to the table definition; the order in which columns are added implies their column number. String columns are defined with the current default collation.
        /// </summary>
        /// <param name="TableDefinition"></param>
        /// <param name="name"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionAddColumn", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionAddColumn(
            IntPtr TableDefinition,
            [MarshalAs(UnmanagedType.LPWStr)] String name,
            Int32 type);

        /// <summary>
        /// Adds a column with a specific collation.
        /// </summary>
        /// <param name="TableDefinition"></param>
        /// <param name="name"></param>
        /// <param name="type"></param>
        /// <param name="collation"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionAddColumnWithCollation", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionAddColumnWithCollation(
            IntPtr TableDefinition,
            [MarshalAs(UnmanagedType.LPWStr)] String name,
            Int32 type, Int32 collation);

        /// <summary>
        /// Returns the number of columns in the table definition.
        /// </summary>
        /// <param name="TableDefinition"></param>
        /// <param name="retval"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionGetColumnCount", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionGetColumnCount(IntPtr TableDefinition, [Out] out Int32 retval);

        /// <summary>
        /// Gives the name of the column.
        /// </summary>
        /// <param name="TableDefinition"></param>
        /// <param name="columnNumber"></param>
        /// <param name="retval"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionGetColumnName", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        private static extern Int32 TabTableDefinitionGetColumnName_API(
            IntPtr TableDefinition,
            Int32 columnNumber,
            [Out] out IntPtr retval);
        public static Int32 TabTableDefinitionGetColumnName(
            IntPtr TableDefinition,
            Int32 columnNumber,
            out string retval)
        {
            IntPtr namePtr;
            Int32 retCode = TabTableDefinitionGetColumnName_API(TableDefinition, columnNumber, out namePtr);
            retval = retCode == TAB_RESULT_Success ?
                System.Runtime.InteropServices.Marshal.PtrToStringUni(namePtr) :
                null;
            return (retCode);
        }

        /// <summary>
        /// Gives the type of the column.
        /// </summary>
        /// <param name="TableDefinition"></param>
        /// <param name="columnNumber"></param>
        /// <param name="retval"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableDefinitionGetColumnType", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableDefinitionGetColumnType(IntPtr TableDefinition, Int32 columnNumber, [Out] out Int32 retval);
        #endregion

        #region Row
        // A tuple of values to be inserted into an extract.
        /// <summary>
        /// Create an empty row with the specified schema.
        /// </summary>
        /// <param name="handle"></param>
        /// <param name="tableDefinition"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowCreate", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowCreate([Out] out IntPtr handle, IntPtr tableDefinition);

        /// <summary>
        /// Closes this Row and frees associated resources.
        /// </summary>
        /// <param name="handle"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowClose", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowClose(IntPtr handle);

        /// <summary>
        /// Sets a column in this row to null.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetNull", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetNull(IntPtr Row, Int32 columnNumber);

        /// <summary>
        /// Sets a column in this row to the specified integer value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetInteger", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetInteger(IntPtr Row, Int32 columnNumber, Int32 value);

        /// <summary>
        /// Sets a column in this row to the specified double value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetDouble", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetDouble(IntPtr Row, Int32 columnNumber, Double value);

        /// <summary>
        /// Sets a column in this row to the specified boolean value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetBoolean", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetBoolean(IntPtr Row, Int32 columnNumber, Int32 value);

        /// <summary>
        /// Sets a column in this row to the specified (wide/Unicode) string value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetString", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetString(
            IntPtr Row, Int32 columnNumber,
            [MarshalAs(UnmanagedType.LPWStr)] String value);

        /// <summary>
        /// Sets a column in this row to the specified string value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetCharString", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetCharString(
            IntPtr Row, Int32 columnNumber,
            [MarshalAs(UnmanagedType.LPTStr)] String value);

        /// <summary>
        /// Sets a column in this row to the specified date value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="day"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetDate", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetDate(IntPtr Row, Int32 columnNumber, Int32 year, Int32 month, Int32 day);

        /// <summary>
        /// Sets a column in this row to the specified date/time value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="day"></param>
        /// <param name="hour"></param>
        /// <param name="min"></param>
        /// <param name="sec"></param>
        /// <param name="frac"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetDateTime", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetDateTime(IntPtr Row, Int32 columnNumber, Int32 year, Int32 month, Int32 day, Int32 hour, Int32 min, Int32 sec, Int32 frac);

        /// <summary>
        /// Sets a column in this row to the specified duration value.
        /// </summary>
        /// <param name="Row"></param>
        /// <param name="columnNumber"></param>
        /// <param name="day"></param>
        /// <param name="hour"></param>
        /// <param name="minute"></param>
        /// <param name="second"></param>
        /// <param name="frac"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabRowSetDuration", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabRowSetDuration(IntPtr Row, Int32 columnNumber, Int32 day, Int32 hour, Int32 minute, Int32 second, Int32 frac);
        #endregion

        #region Table
        // A table in the extract.
        /// <summary>
        /// Queue a row for insertion; may perform insert of buffered rows.
        /// </summary>
        /// <param name="Table"></param>
        /// <param name="row"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabTableInsert", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabTableInsert(IntPtr Table, IntPtr row);
        #endregion

        #region Extract
        // A Tableau Data Engine database.
        /// <summary>
        /// Create an extract object with an absolute or relative file system path. This object must be closed.
        /// </summary>
        /// <param name="handle"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabExtractCreate", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabExtractCreate(
            [Out] out IntPtr handle,
            [MarshalAs(UnmanagedType.LPWStr)] String path);

        /// <summary>
        /// Closes the extract and any open tables.
        /// </summary>
        /// <param name="handle"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabExtractClose", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabExtractClose(IntPtr handle);

        /// <summary>
        /// Creates and adds table to the extract
        /// </summary>
        /// <param name="Extract"></param>
        /// <param name="name"></param>
        /// <param name="tableDefinition"></param>
        /// <param name="retval"></param>
        /// <returns></returns>
        [DllImport("DataExtract.dll", EntryPoint = "TabExtractAddTable", PreserveSig = true, SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.Cdecl)]
        public static extern Int32 TabExtractAddTable(
            IntPtr Extract,
            [MarshalAs(UnmanagedType.LPWStr)] String name,
            IntPtr tableDefinition, [Out] out IntPtr retval);
        #endregion

        #region Load TDE API DLL & Import Constants from it
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr LoadLibrary(string lpszLib);
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool SetDllDirectory(string lpPathName);


        private static string BaseDirectory = AppDomain.CurrentDomain.BaseDirectory + "//bin";

        // Default folder for 32 bit TDE API on 32 bit Windows
        private static string TDE32Win32Folder = BaseDirectory;
        // Default folder for 32 bit TDE API on 64 bit Windows
        private static string TDE32Win64Folder = BaseDirectory;
        // Default folder for 64 bit TDE API on 64 bit Windows
        private static string TDE64Win64Folder = BaseDirectory;
        static DataExtractAPI()
        {
            #region Load the "correct" TDE API module
            // Determine the correct TDE API folder for the running app
            string tdeFolder = IntPtr.Size == 8 ? DataExtractAPILocation.TDE64Folder : DataExtractAPILocation.TDE32Folder;
            if (tdeFolder == null)
            {
                if (IntPtr.Size == 8)
                    tdeFolder = TDE64Win64Folder;
                else if (Environment.GetEnvironmentVariable("PROCESSOR_ARCHITEW6432") != null)
                    tdeFolder = TDE32Win64Folder;
                else
                    tdeFolder = TDE32Win32Folder;
            }

            // Determine the TDE API module
            FileInfo tdeAPI = new FileInfo(Path.Combine(tdeFolder, "DataExtract.dll"));

            // Validate the TDE API folder exists
            if (!tdeAPI.Directory.Exists)
            {
                throw new DirectoryNotFoundException(
                    String.Format("TDI API folder '{0}' NOT found.\r\nTableau.DataExtractAPILocation.{1} must be set to the folder containing the Tableau Data Extract API DLLs.",
                    tdeAPI.Directory.FullName, IntPtr.Size == 8 ? "TDE64bitFolder" : "TDE32bitFolder"));
            }

            // Validate the TDE API module exists
            if (!tdeAPI.Exists)
            {
                throw new FileNotFoundException(
                    String.Format("TDE API module '{0}' was NOT found.\r\nTableau.DataExtractAPILocation.{1} must be set to the folder containing the Tableau Data Extract API DLLs.",
                    tdeAPI.FullName, IntPtr.Size == 8 ? "TDE64bitFolder" : "TDE32bitFolder"));
            }

            // Point Windows at the appropriate TDE API folder
            // - this "sort of" works, as the correct DLL will load, but
            //   failures occur when the DLL goes to use 'tdeserverXX.exe'
            //   as it won't be found.
            //if( !SetDllDirectory( tdeAPI.Directory.FullName ) )
            //    throw new TypeUnloadedException();
            // - discovered that I can modify the PATH as seen by this
            //   application only, and that this will solve all the
            //   loading problems.
            Environment.SetEnvironmentVariable("PATH",
                Environment.GetEnvironmentVariable("PATH") + ";" +
                tdeAPI.Directory.FullName);

            // Load the TDE API module
            IntPtr tdeHandle = LoadLibrary(tdeAPI.Name);
            if (tdeHandle == IntPtr.Zero)
                throw new TypeUnloadedException(
                    String.Format("Failed to load the TDE API module '{0}'.",
                    tdeAPI.FullName));
            #endregion

            #region Import TDE Constants
            // Import TAB_TYPE
            TAB_TYPE_Integer = ImportInt(tdeHandle, "TAB_TYPE_Integer");
            TAB_TYPE_Double = ImportInt(tdeHandle, "TAB_TYPE_Double");
            TAB_TYPE_Boolean = ImportInt(tdeHandle, "TAB_TYPE_Boolean");
            TAB_TYPE_Date = ImportInt(tdeHandle, "TAB_TYPE_Date");
            TAB_TYPE_DateTime = ImportInt(tdeHandle, "TAB_TYPE_DateTime");
            TAB_TYPE_Duration = ImportInt(tdeHandle, "TAB_TYPE_Duration");
            TAB_TYPE_CharString = ImportInt(tdeHandle, "TAB_TYPE_CharString");
            TAB_TYPE_UnicodeString = ImportInt(tdeHandle, "TAB_TYPE_UnicodeString");

            // Import TAB_RESULT
            TAB_RESULT_Success = ImportInt(tdeHandle, "TAB_RESULT_Success");
            TAB_RESULT_OutOfMemory = ImportInt(tdeHandle, "TAB_RESULT_OutOfMemory");
            TAB_RESULT_PermissionDenied = ImportInt(tdeHandle, "TAB_RESULT_PermissionDenied");
            TAB_RESULT_InvalidFile = ImportInt(tdeHandle, "TAB_RESULT_InvalidFile");
            TAB_RESULT_FileExists = ImportInt(tdeHandle, "TAB_RESULT_FileExists");
            TAB_RESULT_TooManyFiles = ImportInt(tdeHandle, "TAB_RESULT_TooManyFiles");
            TAB_RESULT_FileNotFound = ImportInt(tdeHandle, "TAB_RESULT_FileNotFound");
            TAB_RESULT_DiskFull = ImportInt(tdeHandle, "TAB_RESULT_DiskFull");
            TAB_RESULT_DirectoryNotEmpty = ImportInt(tdeHandle, "TAB_RESULT_DirectoryNotEmpty");
            TAB_RESULT_NoSuchDatabase = ImportInt(tdeHandle, "TAB_RESULT_NoSuchDatabase");
            TAB_RESULT_QueryError = ImportInt(tdeHandle, "TAB_RESULT_QueryError");
            TAB_RESULT_NullArgument = ImportInt(tdeHandle, "TAB_RESULT_NullArgument");
            TAB_RESULT_DataEngineError = ImportInt(tdeHandle, "TAB_RESULT_DataEngineError");
            TAB_RESULT_Cancelled = ImportInt(tdeHandle, "TAB_RESULT_Cancelled");
            TAB_RESULT_BadIndex = ImportInt(tdeHandle, "TAB_RESULT_BadIndex");
            TAB_RESULT_ProtocolError = ImportInt(tdeHandle, "TAB_RESULT_ProtocolError");
            TAB_RESULT_NetworkError = ImportInt(tdeHandle, "TAB_RESULT_NetworkError");
            TAB_RESULT_InternalError = ImportInt(tdeHandle, "TAB_RESULT_InternalError");
            TAB_RESULT_WrongType = ImportInt(tdeHandle, "TAB_RESULT_WrongType");
            TAB_RESULT_UsageError = ImportInt(tdeHandle, "TAB_RESULT_UsageError");
            TAB_RESULT_InvalidArgument = ImportInt(tdeHandle, "TAB_RESULT_InvalidArgument");
            TAB_RESULT_BadHandle = ImportInt(tdeHandle, "TAB_RESULT_BadHandle");
            TAB_RESULT_UnknownError = ImportInt(tdeHandle, "TAB_RESULT_UnknownError");

            // Import TAB_COLLATION
            TAB_COLLATION_Binary = ImportInt(tdeHandle, "TAB_COLLATION_Binary");
            TAB_COLLATION_ar = ImportInt(tdeHandle, "TAB_COLLATION_ar");
            TAB_COLLATION_cs = ImportInt(tdeHandle, "TAB_COLLATION_cs");
            TAB_COLLATION_cs_CI = ImportInt(tdeHandle, "TAB_COLLATION_cs_CI");
            TAB_COLLATION_cs_CI_AI = ImportInt(tdeHandle, "TAB_COLLATION_cs_CI_AI");
            TAB_COLLATION_da = ImportInt(tdeHandle, "TAB_COLLATION_da");
            TAB_COLLATION_de = ImportInt(tdeHandle, "TAB_COLLATION_de");
            TAB_COLLATION_el = ImportInt(tdeHandle, "TAB_COLLATION_el");
            TAB_COLLATION_en_GB = ImportInt(tdeHandle, "TAB_COLLATION_en_GB");
            TAB_COLLATION_en_US = ImportInt(tdeHandle, "TAB_COLLATION_en_US");
            TAB_COLLATION_en_US_CI = ImportInt(tdeHandle, "TAB_COLLATION_en_US_CI");
            TAB_COLLATION_es = ImportInt(tdeHandle, "TAB_COLLATION_es");
            TAB_COLLATION_es_CI_AI = ImportInt(tdeHandle, "TAB_COLLATION_es_CI_AI");
            TAB_COLLATION_et = ImportInt(tdeHandle, "TAB_COLLATION_et");
            TAB_COLLATION_fi = ImportInt(tdeHandle, "TAB_COLLATION_fi");
            TAB_COLLATION_fr_CA = ImportInt(tdeHandle, "TAB_COLLATION_fr_CA");
            TAB_COLLATION_fr_FR = ImportInt(tdeHandle, "TAB_COLLATION_fr_FR");
            TAB_COLLATION_fr_FR_CI_AI = ImportInt(tdeHandle, "TAB_COLLATION_fr_FR_CI_AI");
            TAB_COLLATION_he = ImportInt(tdeHandle, "TAB_COLLATION_he");
            TAB_COLLATION_hu = ImportInt(tdeHandle, "TAB_COLLATION_hu");
            TAB_COLLATION_is = ImportInt(tdeHandle, "TAB_COLLATION_is");
            TAB_COLLATION_it = ImportInt(tdeHandle, "TAB_COLLATION_it");
            TAB_COLLATION_ja = ImportInt(tdeHandle, "TAB_COLLATION_ja");
            TAB_COLLATION_ja_JIS = ImportInt(tdeHandle, "TAB_COLLATION_ja_JIS");
            TAB_COLLATION_ko = ImportInt(tdeHandle, "TAB_COLLATION_ko");
            TAB_COLLATION_lt = ImportInt(tdeHandle, "TAB_COLLATION_lt");
            TAB_COLLATION_lv = ImportInt(tdeHandle, "TAB_COLLATION_lv");
            TAB_COLLATION_nl_NL = ImportInt(tdeHandle, "TAB_COLLATION_nl_NL");
            TAB_COLLATION_nn = ImportInt(tdeHandle, "TAB_COLLATION_nn");
            TAB_COLLATION_pl = ImportInt(tdeHandle, "TAB_COLLATION_pl");
            TAB_COLLATION_pt_BR = ImportInt(tdeHandle, "TAB_COLLATION_pt_BR");
            TAB_COLLATION_pt_BR_CI_AI = ImportInt(tdeHandle, "TAB_COLLATION_pt_BR_CI_AI");
            TAB_COLLATION_pt_PT = ImportInt(tdeHandle, "TAB_COLLATION_pt_PT");
            TAB_COLLATION_root = ImportInt(tdeHandle, "TAB_COLLATION_root");
            TAB_COLLATION_ru = ImportInt(tdeHandle, "TAB_COLLATION_ru");
            TAB_COLLATION_sl = ImportInt(tdeHandle, "TAB_COLLATION_sl");
            TAB_COLLATION_sv_FI = ImportInt(tdeHandle, "TAB_COLLATION_sv_FI");
            TAB_COLLATION_sv_SE = ImportInt(tdeHandle, "TAB_COLLATION_sv_SE");
            TAB_COLLATION_tr = ImportInt(tdeHandle, "TAB_COLLATION_tr");
            TAB_COLLATION_uk = ImportInt(tdeHandle, "TAB_COLLATION_uk");
            TAB_COLLATION_vi = ImportInt(tdeHandle, "TAB_COLLATION_vi");
            TAB_COLLATION_zh_Hans_CN = ImportInt(tdeHandle, "TAB_COLLATION_zh_Hans_CN");
            TAB_COLLATION_zh_Hant_TW = ImportInt(tdeHandle, "TAB_COLLATION_zh_Hant_TW");
            #endregion
        }

        private static Int32 ImportInt(IntPtr dllHandle, string varName)
        {
            IntPtr varAddr = GetProcAddress(dllHandle, varName);
            if (varAddr != IntPtr.Zero)
                return (Marshal.ReadInt32(varAddr));
            throw new MissingMemberException(varName);
        }
        #endregion
    }
}

//---------------------------------------------------------------------------//
// EOF
